import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Mic, 
  Brain, 
  RefreshCw, 
  Calendar
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Voice Recording',
    description: 'Capture lectures with crystal-clear audio recording'
  },
  {
    icon: Brain,
    title: 'AI Transcription',
    description: 'Convert speech to text with high accuracy'
  },
  {
    icon: RefreshCw,
    title: 'Smart Summaries',
    description: 'Get AI-generated summaries of your notes'
  },
  {
    icon: Calendar,
    title: 'Study Planning',
    description: 'Organize your study schedule effectively'
  }
];

export const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to enhance your learning experience and stay focused on what matters most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
