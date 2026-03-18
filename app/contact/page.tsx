'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { COLORS, SERVICE_AREAS } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceArea: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceArea: '',
      });
      toast.success(t?.contact?.success ?? "Thank you! We'll contact you soon.");
    } catch (error) {
      toast.error(t?.contact?.error ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.accent }} />
          <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {t?.contact?.success ?? "Message sent successfully!"}
          </h2>
          <p style={{ color: COLORS.text.secondary }}>We'll get back to you soon.</p>
          <Button
            onClick={() => setSuccess(false)}
            className="mt-6"
            style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: `${COLORS.primary}05` }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ color: COLORS.primary }}>
            {t?.contact?.title ?? 'Contact Us'}
          </h1>
          <p className="text-xl" style={{ color: COLORS.text.secondary }}>
            {t?.contact?.subtitle ?? 'Get in touch with our team'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 mt-1" style={{ color: COLORS.accent }} />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+1234567890" className="hover:underline" style={{ color: COLORS.text.secondary }}>
                    386-603-9541
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 mt-1" style={{ color: COLORS.accent }} />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:info@iqeslowvoltage.com" className="hover:underline" style={{ color: COLORS.text.secondary }}>
                    info@iqeslowvoltage.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 mt-1" style={{ color: COLORS.accent }} />
                <div>
                  <h3 className="font-semibold mb-1">Service Areas</h3>
                  <p style={{ color: COLORS.text.secondary }}>
                    Serving all of Florida<br />
                    150-mile coverage radius
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t?.contact?.name ?? 'Full Name'} *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">{t?.contact?.email ?? 'Email'} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t?.contact?.phone ?? 'Phone'}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="serviceArea">{t?.contact?.serviceArea ?? 'Service Area'}</Label>
                <Select value={formData.serviceArea} onValueChange={(value) => handleChange('serviceArea', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_AREAS.map((area) => (
                      <SelectItem key={area.city} value={area.city}>
                        {area.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">{t?.contact?.subject ?? 'Subject'} *</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="message">{t?.contact?.message ?? 'Message'} *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                style={{ backgroundColor: COLORS.cta, color: COLORS.white }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  t?.contact?.submit ?? 'Send Message'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
