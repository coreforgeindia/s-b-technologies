import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

interface ContactData {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

const INTEREST_MAP: Record<string, string> = {
  smt: 'SMT Assembly',
  pcb: 'PCB Assembly (Through-Hole & SMD)',
  soldering: 'Reflow / Wave Soldering',
  bga: 'BGA / QFP / QFN Assembly',
  cad: 'PCB CAD & CAM Design',
  prototype: 'Prototype & Rework',
  other: 'Other / General Inquiry',
};

// Create a SMTP transporter using environment variables or a fallback mock
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isValid = (val: string | undefined) => val && val !== 'undefined' && val !== '';

  if (isValid(host) && isValid(user) && isValid(pass)) {
    console.log(`[Email] Configuring SMTP transporter for ${host}:${port}`);
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  console.warn('[Email] SMTP credentials not set. Falling back to console-logging transporter.');
  // Return a transporter that logs email content to the console
  return {
    sendMail: async (options: any) => {
      console.log('============= MOCK EMAIL SENT =============');
      console.log(`From: ${options.from}`);
      console.log(`To: ${options.to}`);
      console.log(`Cc: ${options.cc || 'None'}`);
      console.log(`Bcc: ${options.bcc || 'None'}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`HTML Length: ${options.html.length} characters`);
      console.log('-------------------------------------------');
      return { messageId: 'mock-id-' + Date.now() };
    }
  } as any;
}

export async function handleContactForm(req: any, res: any) {
  try {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });

    req.on('end', async () => {
      let data: ContactData;
      try {
        data = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request body' }));
        return;
      }

      const { name, company, email, phone, interest, message } = data;
      if (!name || !email || !message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Name, email, and message are required fields' }));
        return;
      }

      // 1. Read the email template
      const templatePath = path.resolve(process.cwd(), 'email_template.html');
      if (!fs.existsSync(templatePath)) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email template not found on server' }));
        return;
      }

      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const interestLabel = INTEREST_MAP[interest] || interest || 'Not Specified';

      // Replace placeholders for the client's thank you email
      let clientHtml = templateContent
        .replace(/\[Full Name\]/g, name)
        .replace(/\[Company Name\]/g, company || 'Not Specified')
        .replace(/\[Email Address\]/g, email)
        .replace(/\[Phone Number\]/g, phone || 'Not Specified')
        .replace(/\[Product\/Service Interest\]/g, interestLabel)
        .replace(/\[Requirements Details\]/g, message.replace(/\n/g, '<br>'));

      // Generate modified HTML for the admin email (instead of "Thank You")
      let adminHtml = clientHtml
        // Replace "Thank You!" heading in the SVG graphic
        .replace(
          /<text x="50%" y="78" text-anchor="middle" font-family="'Brush Script MT', cursive, 'Georgia', serif" font-size="64" font-weight="bold" fill="#0f2e5a" transform="rotate\(-3, 200, 65\)">Thank You!<\/text>/g,
          '<text x="50%" y="78" text-anchor="middle" font-family="\'Brush Script MT\', cursive, \'Georgia\', serif" font-size="64" font-weight="bold" fill="#0f2e5a" transform="rotate(-3, 200, 65)">New Inquiry!</text>'
        )
        // Also support replace without escape sequence just in case
        .replace(
          'Thank You!',
          'New Inquiry!'
        )
        // Change personal greeting to Admin greeting
        .replace(`Hi ${name},`, 'Hi Admin,')
        // Change introduction paragraph
        .replace(
          /Thank you for reaching out to <strong>S\.B\. Technologies<\/strong>\. We have successfully received your request for a quote and it has been noted by our team\./g,
          'A new inquiry has been submitted on the website. Below are the details of the submission.'
        )
        .replace(
          'Thank you for reaching out to <strong>S.B. Technologies</strong>. We have successfully received your request for a quote and it has been noted by our team.',
          'A new inquiry has been submitted on the website. Below are the details of the submission.'
        )
        // Remove the reassuring "our engineering teams are reviewing..." paragraph for admin
        .replace(
          /<p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">\s*Our engineering and technical teams are currently reviewing your design files and requirements\..*?<\/p>/gs,
          ''
        )
        .replace(
          'Our engineering and technical teams are currently reviewing your design files and requirements. We understand that your project\'s timeline and technical specifications are critical, and we are committed to providing you with an accurate and competitive proposal.',
          ''
        );

      const transporter = getTransporter();
      const fromEmail = process.env.SMTP_USER || 'coreforge.in@gmail.com';

      // Send Email 1: Thank You to the Client
      const clientMailOptions = {
        from: `"S.B. Technologies" <${fromEmail}>`,
        to: email,
        bcc: 'coreforge.in@gmail.com, info@coreforgeindia.com, info@sbtechindia.com',
        subject: 'Thank You for Your Inquiry - S.B. Technologies',
        html: clientHtml,
      };

      // Send Email 2: Notification to Admin
      const adminMailOptions = {
        from: `"S.B. Technologies Web" <${fromEmail}>`,
        to: 'info@sbtechindia.com',
        bcc: 'coreforge.in@gmail.com, info@coreforgeindia.com',
        subject: `New Inquiry Received: ${name} - ${company || 'No Company'}`,
        html: adminHtml,
      };

      try {
        console.log('[Email] Sending thank-you email to client:', email);
        const clientResult = await transporter.sendMail(clientMailOptions);
        console.log('[Email] ✅ Client email sent! Message ID:', clientResult.messageId);

        console.log('[Email] Sending inquiry notification to admin...');
        const adminResult = await transporter.sendMail(adminMailOptions);
        console.log('[Email] ✅ Admin email sent! Message ID:', adminResult.messageId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Emails sent successfully' }));
      } catch (err: any) {
        console.error('[Email] ❌ Failed to send email:', err.message);
        console.error('[Email] Full error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Failed to send email: ${err.message}` }));
      }
    });
  } catch (err: any) {
    console.error('[Email] Internal error in handler:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
