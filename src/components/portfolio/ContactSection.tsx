'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { ProfileData } from '@/lib/types';

interface ContactSectionProps {
  profile: ProfileData | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
            <span className="text-emerald-400">#</span> Contact
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ echo &quot;Let&apos;s connect&quot; | send_message
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-zinc-900/50 border-zinc-800 h-full">
              <CardHeader>
                <CardTitle className="text-white font-mono text-base">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-emerald-500/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm break-all">{profile.email}</span>
                  </a>
                )}
                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-emerald-500/10 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile.phone}</span>
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-emerald-500/10 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-sm break-all">{profile.website}</span>
                  </a>
                )}

                <Separator className="bg-zinc-800" />

                {/* Social Links */}
                <div>
                  <p className="text-zinc-500 text-xs font-mono mb-3">
                    {'// social links'}
                  </p>
                  <div className="flex items-center gap-3">
                    {profile?.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profile?.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {profile?.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
          >
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-zinc-400 text-sm font-mono">
                        <span className="text-emerald-500">$</span> name{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-zinc-400 text-sm font-mono">
                        <span className="text-emerald-500">$</span> email{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-zinc-400 text-sm font-mono">
                      <span className="text-emerald-500">$</span> subject
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-zinc-400 text-sm font-mono">
                      <span className="text-emerald-500">$</span> message{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      required
                      rows={5}
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 font-mono text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
