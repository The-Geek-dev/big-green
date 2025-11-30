import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  subject: z.string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - in production, you would send this to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white px-3 sm:px-4 pt-24 sm:pt-32 pb-12 sm:pb-16"
      >
        <div className="container max-w-7xl px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">
            GET IN <span className="highlight-yellow">TOUCH</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed max-w-4xl">
            Have questions about our programs, grants, or how to get involved? We'd love to hear from you. 
            Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="container max-w-7xl px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6">
                  CONTACT <span className="highlight-yellow">INFORMATION</span>
                </h2>
                <p className="text-foreground/70 text-base sm:text-lg mb-8">
                  Feel free to reach out through any of these channels. We're here to help!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-foreground/70">contact@biggreen.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-foreground/70">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-foreground/70">
                      123 Green Street<br />
                      Denver, CO 80202<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <h2 className="text-2xl sm:text-3xl font-black mb-6">
                SEND US A <span className="highlight-yellow">MESSAGE</span>
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            {...field} 
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="your.email@example.com" 
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What is this about?" 
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us more about your inquiry..."
                            rows={6}
                            {...field}
                            className="bg-background resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full button-gradient"
                    size="lg"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container max-w-4xl px-3 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
              FREQUENTLY ASKED <span className="highlight-yellow">QUESTIONS</span>
            </h2>
            <p className="text-foreground/70 text-base sm:text-lg">
              Find answers to common questions about our programs and grants
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  How do I apply for a Big Green grant?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  You can apply for a grant by clicking the "Apply Now" button on our homepage or navigation menu. 
                  Fill out the application form with your information, and our team will review your submission. 
                  We offer grants for schools, individuals, businesses, and housing communities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  What is the typical grant amount?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  Grant amounts vary depending on the program and your tier level. Tier 1 members receive up to 
                  $65,000 in total grants, Tier 2 members can access up to $50,000, and Tier 3 VIP members have 
                  unlimited withdrawal capacity. Each tier also includes daily rewards and bonuses.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  How long does the application process take?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  Most applications are reviewed within 5-7 business days. Tier 2 and Tier 3 members receive 
                  priority processing, with applications often reviewed within 24-48 hours. You'll receive 
                  email updates throughout the process.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  Can I upgrade my tier level later?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  Yes! You can upgrade from Tier 1 to Tier 2 or Tier 3 at any time. Tier 2 requires a one-time 
                  $1,000 investment and unlocks $100 daily rewards plus priority processing. Tier 3 VIP members 
                  receive $500 every 4 hours, unlimited withdrawals, and a complimentary Cybertruck.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  What types of projects qualify for grants?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  We fund a wide range of food-growing projects including school gardens, home gardens, community 
                  gardens, urban farming initiatives, rooftop gardens, and sustainable agriculture businesses. 
                  Projects should focus on growing food and building sustainable communities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  Do I need prior gardening experience?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  No prior experience is required! Big Green provides resources, educational materials, and support 
                  to help you succeed. Our Jumpstart program for schools includes training for educators, and we 
                  offer guidance for individual gardeners at all skill levels.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  How do withdrawals work?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  Tier 1 members can request withdrawals through their dashboard. Tier 2 members receive priority 
                  processing on all withdrawal requests with 24/7 support. Tier 3 VIP members enjoy unlimited instant 
                  withdrawals with no waiting period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left font-semibold">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  We accept cryptocurrency payments including Bitcoin, Ethereum, and USDT. Our secure crypto payment 
                  platform makes it easy to invest in your tier level and access grant funding. Traditional payment 
                  methods may also be available depending on your location.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-foreground/70 mb-4">
              Still have questions? We're here to help!
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="outline"
              size="lg"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
