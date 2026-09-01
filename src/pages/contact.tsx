import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyInfo } from "@/data/content";
import { useCompanyProfile } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(2, "Company is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  interest: z.string().min(1, "Please select an area of interest"),
  message: z.string().min(10, "Please provide more details"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useCompanyProfile();

  // Use Supabase profile data if available, otherwise static
  const contactInfo = {
    address: profile?.address || companyInfo.address,
    phones: profile?.phones || companyInfo.phones,
    email: profile?.email || companyInfo.email,
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        toast({
          title: "Inquiry Sent Successfully",
          description: "A quote confirmation email has been sent.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error Sending Request",
          description: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not connect to the server. Please check your internet connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white">
      <section className="bg-zinc-950 py-20 border-b-4 border-primary">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Get in touch for requirements, technical queries or to schedule a factory visit.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Let's Discuss Your PCB & EMS Needs</h2>
              <p className="text-zinc-600 mb-10 text-lg leading-relaxed">
                Whether you need a prototype PCB assembly or a high-volume SMT production run, our engineering team is ready to assist you.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Factory & Office</h4>
                    <p className="text-zinc-600 leading-relaxed max-w-xs">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Call Us</h4>
                    <a href="tel:+919845779326" className="text-zinc-600 hover:text-primary transition-colors text-base font-medium block">
                      +91 98457 79326
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                      WhatsApp
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Fast Response</span>
                    </h4>
                    <a
                      href="https://wa.me/917353775422"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-bold text-base transition-colors flex items-center gap-1.5"
                    >
                      +91 73537 75422
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-zinc-600 hover:text-primary transition-colors text-base">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-zinc-50 p-8 md:p-10 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Request Received</h3>
                  <p className="text-zinc-600 mb-8 max-w-md">
                    Thank you for reaching out to S.B. Technologies. Our engineering team will review your requirements and contact you shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-6 text-zinc-900">Request a Quote</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Krishna" className="bg-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Tirupati Industries" className="bg-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="krishna@tirupati.com" className="bg-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 XXXXX XXXXX" className="bg-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="interest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product/Service Interest</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="smt">SMT Assembly</SelectItem>
                                <SelectItem value="pcb">PCB Assembly (Through-Hole & SMD)</SelectItem>
                                <SelectItem value="soldering">Reflow / Wave Soldering</SelectItem>
                                <SelectItem value="bga">BGA / QFP / QFN Assembly</SelectItem>
                                <SelectItem value="cad">PCB CAD & CAM Design</SelectItem>
                                <SelectItem value="prototype">Prototype & Rework</SelectItem>
                                <SelectItem value="design-support">Design Support & Product Development</SelectItem>
                                <SelectItem value="other">Other / General Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirements Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your PCB assembly requirements, BOM details, quantity and any special specifications..."
                                className="min-h-[120px] bg-white resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-base mt-2"
                      >
                        {isSubmitting ? "Submitting Request..." : "Submit Request"}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-3">Find Us</h2>
            <div className="h-1 w-16 bg-primary mx-auto mb-4"></div>
            <p className="text-zinc-500 text-sm">Visit our manufacturing facility in Bangalore</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124433.29779663625!2d77.38438449726563!3d12.937224299999993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae155fa37a7207%3A0x6029ca147b1987d2!2sS.B.TECHNOLOGIES!5e0!3m2!1sen!2sin!4v1787828548803!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="S.B. Technologies Location"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
