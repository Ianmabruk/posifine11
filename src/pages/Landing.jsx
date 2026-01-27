import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, TrendingUp, Users, Package, BarChart3, Play, Activity, ChevronRight, Sparkles, Layers, DollarSign } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const meshY = useTransform(scrollY, [0, 800], [0, 200]);
  
  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'cashier') navigate('/cashier');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Sync',
      description: 'Instant inventory updates across all devices with WebSocket technology',
      color: 'from-[#00ff88] to-[#00cc6a]'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption and role-based access control',
      color: 'from-[#ff6b35] to-[#ff8c42]'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'AI-powered insights to boost revenue and optimize inventory',
      color: 'from-[#00ff88] to-[#ff6b35]'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Automated stock tracking with low-stock alerts and reordering',
      color: 'from-[#ff6b35] to-[#00ff88]'
    },
    {
      icon: Users,
      title: 'Multi-User Access',
      description: 'Team collaboration with customizable permissions per role',
      color: 'from-[#00ff88] to-[#ff6b35]'
    },
    {
      icon: BarChart3,
      title: 'Advanced Reports',
      description: 'Comprehensive sales reports with trend analysis and forecasting',
      color: 'from-[#ff6b35] to-[#00cc6a]'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<50ms', label: 'Response Time' },
    { value: '10K+', label: 'Businesses' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Mesh */}
      <motion.div 
        style={{ y: meshY }}
        className="fixed inset-0 pointer-events-none opacity-30"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/10 via-white to-[#ff6b35]/10" />
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke="url(#gridGradient)" 
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#00ff88]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#ff6b35]/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ff88]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
              PosiFine
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/choose-subscription')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-white rounded-full font-medium shadow-lg shadow-[#00ff88]/30 hover:shadow-xl hover:shadow-[#00ff88]/40 transition-all hover:scale-105"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 pt-20 pb-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-[#00ff88]/10 to-[#ff6b35]/10 border border-[#00ff88]/30 rounded-full text-sm font-medium mb-6"
                >
                  <span className="bg-gradient-to-r from-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                    ⚡ Next-Generation POS Technology
                  </span>
                </motion.span>

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="text-gray-900">Elevate Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00ff88] via-[#00cc6a] to-[#ff6b35] bg-clip-text text-transparent">
                    Business Today
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Experience the future of point-of-sale with real-time sync,
                  intelligent analytics, and enterprise-grade security.
                  Built for modern businesses that demand excellence.
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <motion.button
                    onClick={() => navigate('/choose-subscription')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-white rounded-full font-semibold shadow-xl shadow-[#00ff88]/30 hover:shadow-2xl hover:shadow-[#00ff88]/40 transition-all flex items-center gap-2"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-semibold hover:border-[#00ff88] transition-all flex items-center gap-2 group"
                  >
                    <Play className="w-5 h-5 text-[#ff6b35]" />
                    Watch Demo
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#00ff88]" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#00ff88]" />
                    <span>14-day trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#00ff88]" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Animated Dashboard Panels */}
            <div className="relative">
              <motion.div
                style={{
                  x: mousePosition.x,
                  y: mousePosition.y
                }}
                className="relative"
              >
                {/* Main Dashboard Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200/50"
                  style={{
                    boxShadow: '0 0 80px rgba(0, 255, 136, 0.15), 0 0 40px rgba(255, 107, 53, 0.1)'
                  }}
                >
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl" />
                      <div>
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-16 bg-gray-100 rounded mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                      <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                    </div>
                  </div>

                  {/* Mock Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-[#00ff88]/10 to-[#00cc6a]/10 rounded-2xl p-4 border border-[#00ff88]/20"
                    >
                      <div className="text-xs text-gray-500 mb-1">Revenue</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
                        $12,450
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#00ff88] mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12.5%</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-[#ff6b35]/10 to-[#ff8c42]/10 rounded-2xl p-4 border border-[#ff6b35]/20"
                    >
                      <div className="text-xs text-gray-500 mb-1">Orders</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] bg-clip-text text-transparent">
                        1,247
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#ff6b35] mt-1">
                        <Activity className="w-3 h-3" />
                        <span>Live</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Mock Chart */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 400 100">
                      <motion.path
                        d="M 0 80 Q 50 60, 100 70 T 200 65 T 300 55 T 400 50"
                        fill="none"
                        stroke="url(#chartGradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00ff88" />
                          <stop offset="100%" stopColor="#ff6b35" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.div>

                {/* Floating Mini Cards */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-8 -right-8 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/50"
                  style={{
                    boxShadow: '0 0 40px rgba(0, 255, 136, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Live Updates</div>
                      <div className="text-sm font-bold text-gray-900">Real-time Sync</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/50"
                  style={{
                    boxShadow: '0 0 40px rgba(255, 107, 53, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Security</div>
                      <div className="text-sm font-bold text-gray-900">Bank-Level</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <section className="relative z-10 py-16 px-6 bg-gradient-to-r from-[#00ff88]/5 via-white to-[#ff6b35]/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#00ff88]/10 to-[#ff6b35]/10 border border-[#00ff88]/30 rounded-full text-sm font-medium mb-6">
              <span className="bg-gradient-to-r from-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                Features that matter
              </span>
            </span>
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-gray-900">Built for</span>{' '}
              <span className="bg-gradient-to-r from-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                Performance
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run your business efficiently, all in one beautiful platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
                
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    Learn more
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#00ff88] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#00ff88] via-[#00cc6a] to-[#ff6b35] rounded-[3rem] p-16 overflow-hidden"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <pattern id="ctaPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#ctaPattern)" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses using PosiFine to streamline operations and boost revenue
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  onClick={() => navigate('/choose-subscription')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-gray-900 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>

              <p className="text-white/80 text-sm mt-8">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                PosiFine
              </span>
            </div>

            <p className="text-gray-600 text-sm">
              © 2026 Mabrixel Technologies. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button onClick={() => navigate('/choose-subscription')} className="hover:text-gray-900 transition-colors">
                Pricing
              </button>
              <button onClick={() => navigate('/auth/login')} className="hover:text-gray-900 transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
