'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import { useEffect, useState } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  inView: boolean;
}

function Counter({ end, duration = 2000, suffix = '', inView }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

export function TrustSection() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const stats = [
    {
      icon: TrendingUp,
      value: 13,
      suffix: '+',
      label: t?.home?.yearsExperience ?? 'Years Experience',
    },
    {
      icon: CheckCircle,
      value: 325,
      suffix: '+',
      label: t?.home?.projectsCompleted ?? 'Projects Completed',
    },
    {
      icon: Users,
      value: 25,
      suffix: '+',
      label: t?.home?.certifiedTechnicians ?? 'Certified Technicians',
    },
    {
      icon: Award,
      value: 98,
      suffix: '%',
      label: t?.home?.satisfactionRate ?? 'Satisfaction Rate',
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ color: COLORS.primary }}>
            {t?.home?.trustTitle ?? 'Why Choose Us'}
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              style={{ backgroundColor: `${COLORS.primary}05` }}
            >
              <stat.icon
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: COLORS.accent }}
              />
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: COLORS.primary }}
              >
                <Counter end={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
