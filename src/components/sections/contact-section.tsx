"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const services = [
  "Brand & Visual Identity",
  "Media Production",
  "Motion & Digital Content",
  "Social Media & Digital",
  "Event Branding",
  "Other",
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "info@nuun.so", href: "mailto:info@nuun.so" },
  { icon: Phone, label: "Phone", value: "+252 61 4272760", href: "tel:+252614272760" },
  { icon: MapPin, label: "Location", value: "KM5 Zoobe, Mogadishu, Somalia", href: null },
];

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
        reset();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">

          {/* Info */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black text-white mb-3 sm:mb-4">Let&apos;s Talk</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Whether you have a project in mind or just want to explore possibilities, we&apos;re here to help you achieve your goals.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#FFD400]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-white text-sm hover:text-[#FFD400] transition-colors">{value}</a>
                    ) : (
                      <p className="text-white text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Office hours */}
            <div className="p-5 sm:p-6 card">
              <p className="text-[#FFD400] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4">Office Hours</p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Monday — Friday</span>
                  <span>8:00 AM — 6:00 PM</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Saturday</span>
                  <span>9:00 AM — 2:00 PM</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 sm:p-8 rounded-3xl"
            >
              {sent ? (
                <div className="text-center py-10 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                    <CheckCircle size={28} className="text-[#FFD400]" />
                  </div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-3">Message Sent!</h3>
                  <p className="text-white/50 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-5 sm:mt-6 text-[#FFD400] text-sm hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <Input label="Full Name *" placeholder="Ahmed Hassan" error={errors.name?.message} {...register("name")} />
                    <Input label="Email *" type="email" placeholder="hello@company.com" error={errors.email?.message} {...register("email")} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <Input label="Phone" type="tel" placeholder="+252 ..." {...register("phone")} />
                    <Input label="Company" placeholder="Your Company" {...register("company")} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Service of Interest</label>
                    <select
                      {...register("service")}
                      className="h-11 sm:h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FFD400]/50 transition-all text-sm"
                    >
                      <option value="" className="bg-[#0A0A0A]">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>
                      ))}
                    </select>
                  </div>

                  <Input label="Subject" placeholder="Project brief summary" {...register("subject")} />

                  <Textarea
                    label="Message *"
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={5}
                    error={errors.message?.message}
                    {...register("message")}
                  />

                  <Button type="submit" loading={isSubmitting} size="lg" className="w-full gap-3">
                    <Send size={15} />
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
