// Cloudflare Pages Function for /api/contact
// Uses Cloudflare Workers TCP sockets to send email via Gmail SMTP
import { connect } from 'cloudflare:sockets';


const INTEREST_MAP: Record<string, string> = {
  smt: 'SMT Assembly',
  pcb: 'PCB Assembly (Through-Hole & SMD)',
  soldering: 'Reflow / Wave Soldering',
  bga: 'BGA / QFP / QFN Assembly',
  cad: 'PCB CAD & CAM Design',
  prototype: 'Prototype & Rework',
  other: 'Other / General Inquiry',
};

// The email template embedded as a constant
const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Inquiry - S.B. Technologies</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .content-padding { padding: 20px !important; }
      .hero-title { font-size: 28px !important; }
      .details-table th, .details-table td { display: block !important; width: 100% !important; box-sizing: border-box; }
      .details-table th { border-bottom: none !important; padding-bottom: 5px !important; }
      .details-table td { padding-top: 5px !important; padding-bottom: 15px !important; border-bottom: 1px solid #eef2f5 !important; }
      .details-table tr:last-child td { border-bottom: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f7f9; padding: 40px 0;">
    <tr>
      <td align="center">
        <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #eef2f5;">
          <tr>
            <td align="center" style="background-color: #0f2e5a; padding: 25px 20px; border-bottom: 4px solid #0082c8;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" style="display: block;">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#0082c8" stroke-width="6" />
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="10 5" />
                            <circle cx="50" cy="50" r="15" fill="#0082c8" />
                            <circle cx="50" cy="15" r="5" fill="#0082c8" />
                            <circle cx="50" cy="85" r="5" fill="#0082c8" />
                            <circle cx="15" cy="50" r="5" fill="#0082c8" />
                            <circle cx="85" cy="50" r="5" fill="#0082c8" />
                          </svg>
                        </td>
                        <td style="vertical-align: middle; text-align: left;">
                          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1px; line-height: 1.1; text-transform: uppercase;">S.B. Technologies</div>
                          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 8px; font-weight: 600; color: #a5d3f5; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px;">Electronics Manufacturing Services</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 40px 40px 10px 40px;" class="content-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 130" width="280" height="91" style="display: block; max-width: 100%;">
                      <path d="M 60 95 C 130 85, 240 82, 330 92 C 300 108, 170 112, 70 102 Z" fill="#ffd13b" opacity="0.85"/>
                      <text x="50%" y="78" text-anchor="middle" font-family="'Brush Script MT', cursive, 'Georgia', serif" font-size="64" font-weight="bold" fill="#0f2e5a" transform="rotate(-3, 200, 65)">{{HERO_TEXT}}</text>
                    </svg>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;" class="content-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #0f2e5a;">Hi {{GREETING_NAME}},</p>
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">{{INTRO_TEXT}}</p>
                    {{REVIEW_TEXT}}
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; overflow: hidden;">
                      <tr>
                        <td style="padding: 18px 20px; background-color: #eef2f5; border-bottom: 1px solid #e2e8f0;">
                          <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f2e5a; text-transform: uppercase; letter-spacing: 0.5px;">Summary of Your Inquiry</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 15px 20px;">
                          <table class="details-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.5; color: #4a5568;">
                            <tr><th align="left" width="35%" style="font-weight: 600; color: #718096; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Product/Service Interest</th><td align="left" width="65%" style="color: #1a202c; font-weight: 500; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">{{INTEREST}}</td></tr>
                            <tr><th align="left" style="font-weight: 600; color: #718096; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Company Name</th><td align="left" style="color: #1a202c; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">{{COMPANY}}</td></tr>
                            <tr><th align="left" style="font-weight: 600; color: #718096; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Email Address</th><td align="left" style="color: #1a202c; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">{{EMAIL}}</td></tr>
                            <tr><th align="left" style="font-weight: 600; color: #718096; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Phone Number</th><td align="left" style="color: #1a202c; padding: 8px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">{{PHONE}}</td></tr>
                            <tr><th align="left" style="font-weight: 600; color: #718096; padding: 8px 0; vertical-align: top;">Requirements Details</th><td align="left" style="color: #1a202c; padding: 8px 0; vertical-align: top;">{{MESSAGE}}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">One of our application engineers will reach out to you within <strong>24 business hours</strong> to discuss the next steps or clarify any questions regarding your requirements.</p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding-bottom: 25px;"><a href="https://sbtechindia.com" target="_blank" style="background-color: #0082c8; color: #ffffff; display: inline-block; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 35px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,130,200,0.3);">Visit Our Website</a></td></tr></table>
                    <hr style="border: 0; border-top: 1px solid #eef2f5; margin: 25px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><p style="margin: 0 0 4px 0; font-size: 14px; color: #718096;">Sincerely,</p><p style="margin: 0 0 2px 0; font-size: 16px; font-weight: 700; color: #0f2e5a;">Engineering Estimations Team</p><p style="margin: 0; font-size: 14px; font-weight: 600; color: #0082c8;">S.B. Technologies</p></td></tr></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 40px; border-top: 1px solid #eef2f5; border-bottom: 6px solid #0f2e5a; text-align: center;" class="content-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr><td align="center" style="font-size: 12px; color: #718096; line-height: 1.8;"><strong>S.B. Technologies</strong><br>Factory &amp; Office: #4, 9th Main, J.C. Industrial Estate, Kanakapura Main Road,<br>Bangalore – 560062, Karnataka, India<br>Phone: 080-26662994 / 9845779326 | Email: <a href="mailto:info@sbtechindia.com" style="color: #0082c8; text-decoration: none; font-weight: 600;">info@sbtechindia.com</a></td></tr>
                <tr><td align="center" style="padding-top: 15px; font-size: 11px; color: #a0aec0;">You are receiving this email because you submitted an inquiry on our website.</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

interface Env {
  SMTP_USER: string;
  SMTP_PASS: string;
}

// Minimal SMTP client using Cloudflare TCP sockets
async function sendSmtpEmail(
  user: string,
  pass: string,
  from: string,
  toList: string[],
  subject: string,
  htmlBody: string
): Promise<void> {
  // @ts-ignore - Cloudflare Workers TCP socket API
  const socket = connect('smtp.gmail.com:465', { secureTransport: 'on' });

  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  async function readResponse(): Promise<string> {
    let result = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      // SMTP responses end with \r\n and have a space after the status code on the last line
      if (result.includes('\r\n') && /^\d{3} /m.test(result)) break;
    }
    return result.trim();
  }

  async function sendCommand(cmd: string): Promise<string> {
    await writer.write(encoder.encode(cmd + '\r\n'));
    return readResponse();
  }

  try {
    // Read greeting
    await readResponse();

    // EHLO
    await sendCommand('EHLO sbtechindia.com');

    // AUTH LOGIN
    await sendCommand('AUTH LOGIN');
    await sendCommand(btoa(user));
    const authResult = await sendCommand(btoa(pass));

    if (!authResult.startsWith('235')) {
      throw new Error('SMTP Authentication failed: ' + authResult);
    }

    // MAIL FROM
    await sendCommand(`MAIL FROM:<${from}>`);

    // RCPT TO for each recipient
    for (const to of toList) {
      const rcptResult = await sendCommand(`RCPT TO:<${to.trim()}>`);
      if (!rcptResult.startsWith('250')) {
        console.error(`RCPT TO failed for ${to}: ${rcptResult}`);
      }
    }

    // DATA
    await sendCommand('DATA');

    // Build RFC 2822 message
    const boundary = 'boundary_' + Date.now();
    const message = [
      `From: "S.B. Technologies" <${from}>`,
      `To: ${toList[0]}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 7bit`,
      `Date: ${new Date().toUTCString()}`,
      ``,
      htmlBody,
      `.`
    ].join('\r\n');

    const result = await sendCommand(message);
    if (!result.startsWith('250')) {
      throw new Error('Failed to send message: ' + result);
    }

    // QUIT
    await sendCommand('QUIT');
  } finally {
    try { writer.close(); } catch (_) {}
    try { reader.cancel(); } catch (_) {}
    socket.close();
  }
}

function buildHtml(
  heroText: string,
  greetingName: string,
  introText: string,
  reviewText: string,
  interest: string,
  company: string,
  email: string,
  phone: string,
  message: string
): string {
  return EMAIL_TEMPLATE
    .replace('{{HERO_TEXT}}', heroText)
    .replace('{{GREETING_NAME}}', greetingName)
    .replace('{{INTRO_TEXT}}', introText)
    .replace('{{REVIEW_TEXT}}', reviewText)
    .replace('{{INTEREST}}', interest)
    .replace('{{COMPANY}}', company)
    .replace('{{EMAIL}}', email)
    .replace('{{PHONE}}', phone)
    .replace('{{MESSAGE}}', message.replace(/\n/g, '<br>'));
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await context.request.json() as any;
    const { name, company, email, phone, interest, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const smtpUser = context.env.SMTP_USER;
    const smtpPass = context.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const interestLabel = INTEREST_MAP[interest] || interest || 'Not Specified';
    const reviewParagraph = `<p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">Our engineering and technical teams are currently reviewing your design files and requirements. We understand that your project's timeline and technical specifications are critical, and we are committed to providing you with an accurate and competitive proposal.</p>`;

    // Build client thank-you email
    const clientHtml = buildHtml(
      'Thank You!',
      name,
      `Thank you for reaching out to <strong>S.B. Technologies</strong>. We have successfully received your request for a quote and it has been noted by our team.`,
      reviewParagraph,
      interestLabel,
      company || 'Not Specified',
      email,
      phone || 'Not Specified',
      message
    );

    // Build admin notification email
    const adminHtml = buildHtml(
      'New Inquiry!',
      'Admin',
      'A new inquiry has been submitted on the website. Below are the details of the submission.',
      '',
      interestLabel,
      company || 'Not Specified',
      email,
      phone || 'Not Specified',
      message
    );

    // Send Email 1: Thank You to Client (BCC to admin addresses)
    const clientRecipients = [email, smtpUser, 'info@coreforgeindia.com', 'info@sbtechindia.com'];
    await sendSmtpEmail(
      smtpUser, smtpPass, smtpUser,
      clientRecipients,
      'Thank You for Your Inquiry - S.B. Technologies',
      clientHtml
    );

    // Send Email 2: New Inquiry to Admin
    const adminRecipients = ['info@sbtechindia.com', smtpUser, 'info@coreforgeindia.com'];
    await sendSmtpEmail(
      smtpUser, smtpPass, smtpUser,
      adminRecipients,
      `New Inquiry Received: ${name} - ${company || 'No Company'}`,
      adminHtml
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err: any) {
    console.error('[Email] Error:', err);
    return new Response(
      JSON.stringify({ error: `Failed to send email: ${err.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
