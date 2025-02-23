import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';

export const Hero = ({ onTryDemo }) => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Quick Learn Tag */}
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-primary font-semibold text-2xl">Quick Learn</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Learn Smarter,{' '}
              <span className="text-primary">We Take Your Notes</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-8">
              AI-powered note-taking to capture, organize, and enhance your learning effortlessly.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onTryDemo}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md"
              >
                Try Free Demo <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-gray-300 hover:border-primary text-gray-700 px-6 py-3 rounded-xl font-medium transition-all shadow-md">
                Watch Video
              </button>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
              <video
                className="w-full rounded-lg"
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800"
              >
                <source src="https://example.com/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="absolute -top-4 -right-4 bg-primary/10 w-full h-full rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
