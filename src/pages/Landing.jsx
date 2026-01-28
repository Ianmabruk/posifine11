import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, TrendingUp, Users, Package, BarChart3, Play, Activity, ChevronRight, Sparkles, Layers, DollarSign, X } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showDemoModal, setShowDemoModal] = useState(false);
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

  // Don't auto-redirect logged-in users - let them see the landing page
  // They can use the navigation menu if they want to go to their dashboard

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Sync',
      description: 'Instant inventory updates across all devices with WebSocket technology',
      color: 'from-[#8b5a2b] to-[#00ff88]'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption and role-based access control',
      color: 'from-[#cd853f] to-[#ff6b35]'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'AI-powered insights to boost revenue and optimize inventory',
      color: 'from-[#8b5a2b] via-[#00ff88] to-[#ff6b35]'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Automated stock tracking with low-stock alerts and reordering',
      color: 'from-[#d2691e] to-[#00ff88]'
    },
    {
      icon: Users,
      title: 'Multi-User Access',
      description: 'Team collaboration with customizable permissions per role',
      color: 'from-[#cd853f] to-[#8b5a2b]'
    },
    {
      icon: BarChart3,
      title: 'Advanced Reports',
      description: 'Comprehensive sales reports with trend analysis and forecasting',
      color: 'from-[#ff6b35] to-[#cd853f]'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<50ms', label: 'Response Time' },
    { value: '10K+', label: 'Businesses' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1810] via-[#3d2817] to-[#1a0f08] overflow-hidden relative">
      {/* African Pattern Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="africanPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Adinkra-inspired symbols */}
              <path d="M 60 10 L 70 30 L 90 30 L 75 45 L 80 65 L 60 50 L 40 65 L 45 45 L 30 30 L 50 30 Z" fill="rgba(139, 90, 43, 0.3)" />
              <circle cx="20" cy="20" r="3" fill="rgba(205, 133, 63, 0.4)" />
              <circle cx="100" cy="20" r="3" fill="rgba(205, 133, 63, 0.4)" />
              <circle cx="20" cy="100" r="3" fill="rgba(205, 133, 63, 0.4)" />
              <circle cx="100" cy="100" r="3" fill="rgba(205, 133, 63, 0.4)" />
              <rect x="55" y="85" width="10" height="10" fill="rgba(139, 90, 43, 0.2)" transform="rotate(45 60 90)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#africanPattern)" />
        </svg>
      </div>

      {/* Animated Wood Grain Texture Background */}
      <motion.div 
        style={{ y: meshY }}
        className="fixed inset-0 pointer-events-none opacity-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b5a2b]/20 via-transparent to-[#cd853f]/20" />
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="woodGrain" width="80" height="80" patternUnits="userSpaceOnUse">
              <path 
                d="M 0 40 Q 20 35, 40 40 T 80 40" 
                fill="none" 
                stroke="url(#woodGradient)" 
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path 
                d="M 0 45 Q 20 42, 40 45 T 80 45" 
                fill="none" 
                stroke="url(#woodGradient)" 
                strokeWidth="0.3"
                opacity="0.3"
              />
            </pattern>
            <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5a2b" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#cd853f" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d2691e" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#woodGrain)" />
        </svg>
      </motion.div>

      {/* Warm Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#8b5a2b]/30 via-[#00ff88]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#cd853f]/30 via-[#ff6b35]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-[#d2691e]/20 to-transparent rounded-full blur-2xl"
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-6 bg-gradient-to-r from-[#2c1810]/95 via-[#3d2817]/95 to-[#2c1810]/95 backdrop-blur-xl border-b border-[#8b5a2b]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#8b5a2b] via-[#00ff88] to-[#cd853f] rounded-xl flex items-center justify-center shadow-lg shadow-[#8b5a2b]/40">
              <Sparkles className="w-6 h-6 text-[#f5deb3]" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#f5deb3] via-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
              PosiFine
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <a href="#features" className="text-[#e8c39e] hover:text-white font-medium transition-colors hidden md:block">
              Features
            </a>
            <a href="#pricing" className="text-[#e8c39e] hover:text-white font-medium transition-colors hidden md:block">
              Pricing
            </a>
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-2.5 text-[#f5deb3] hover:text-white font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/choose-subscription')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8b5a2b] via-[#00ff88] to-[#cd853f] text-white rounded-full font-medium shadow-lg shadow-[#8b5a2b]/40 hover:shadow-xl hover:shadow-[#00ff88]/50 transition-all hover:scale-105"
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
                  className="inline-block px-4 py-2 bg-gradient-to-r from-[#8b5a2b]/20 to-[#00ff88]/20 border border-[#8b5a2b]/40 rounded-full text-sm font-medium mb-6"
                >
                  <span className="bg-gradient-to-r from-[#cd853f] to-[#00ff88] bg-clip-text text-transparent">
                    ⚡ Next-Generation POS Technology
                  </span>
                </motion.span>

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="text-[#f5deb3]">Elevate Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#8b5a2b] via-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                    Business Today
                  </span>
                </h1>

                <p className="text-xl text-[#e8c39e] mb-8 leading-relaxed">
                  Experience the future of point-of-sale with real-time sync,
                  intelligent analytics, and enterprise-grade security.
                  Built for modern businesses that demand excellence.
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <motion.button
                    onClick={() => navigate('/choose-subscription')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-[#8b5a2b] via-[#00ff88] to-[#cd853f] text-white rounded-full font-semibold shadow-xl shadow-[#8b5a2b]/40 hover:shadow-2xl hover:shadow-[#00ff88]/50 transition-all flex items-center gap-2"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    onClick={() => setShowDemoModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-[#3d2817]/80 backdrop-blur-xl border-2 border-[#8b5a2b]/40 text-[#f5deb3] rounded-full font-semibold hover:border-[#00ff88]/60 transition-all flex items-center gap-2 group"
                  >
                    <Play className="w-5 h-5 text-[#ff6b35]" />
                    Watch Demo
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-8 text-sm text-[#e8c39e]">
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
                  className="relative bg-[#3d2817]/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-[#8b5a2b]/40"
                  style={{
                    boxShadow: '0 0 80px rgba(139, 90, 43, 0.3), 0 0 40px rgba(0, 255, 136, 0.2)'
                  }}
                >
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8b5a2b] to-[#00ff88] rounded-xl" />
                      <div>
                        <div className="h-3 w-24 bg-[#2c1810]/60 rounded" />
                        <div className="h-2 w-16 bg-[#2c1810]/40 rounded mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-[#2c1810]/40 rounded-lg" />
                      <div className="w-8 h-8 bg-[#2c1810]/40 rounded-lg" />
                    </div>
                  </div>

                  {/* Mock Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-[#8b5a2b]/30 to-[#00ff88]/20 rounded-2xl p-4 border border-[#8b5a2b]/30"
                    >
                      <div className="text-xs text-[#d2a679] mb-1">Revenue</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#cd853f] to-[#00ff88] bg-clip-text text-transparent">
                        $12,450
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#00ff88] mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12.5%</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-[#cd853f]/30 to-[#ff6b35]/20 rounded-2xl p-4 border border-[#cd853f]/30"
                    >
                      <div className="text-xs text-[#d2a679] mb-1">Orders</div>
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
                  <div className="relative h-40 bg-gradient-to-br from-[#2c1810]/80 to-[#1a0f08]/90 rounded-2xl p-4 overflow-hidden">
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
                          <stop offset="0%" stopColor="#8b5a2b" />
                          <stop offset="50%" stopColor="#00ff88" />
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
                  className="absolute -top-8 -right-8 bg-[#3d2817]/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-[#8b5a2b]/40"
                  style={{
                    boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8b5a2b] to-[#00ff88] rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-[#d2a679]">Live Updates</div>
                      <div className="text-sm font-bold text-[#f5deb3]">Real-time Sync</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-8 -left-8 bg-[#3d2817]/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-[#cd853f]/40"
                  style={{
                    boxShadow: '0 0 40px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-[#d2a679]">Security</div>
                      <div className="text-sm font-bold text-[#f5deb3]">Bank-Level</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-gradient-to-br from-[#3d2817] via-[#2c1810] to-[#1a0f08] rounded-3xl shadow-2xl border border-[#8b5a2b]/40 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#2c1810]/80 backdrop-blur-xl rounded-full border border-[#8b5a2b]/40 text-[#f5deb3] hover:text-white hover:border-[#00ff88]/60 transition-all hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#f5deb3] via-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent mb-2">
                    PosiFine Demo
                  </h2>
                  <p className="text-[#d2a679]">
                    See how our premium POS system transforms retail management
                  </p>
                </div>

                {/* Video Container */}
                <div className="relative aspect-video bg-[#1a0f08]/90 rounded-2xl overflow-hidden border border-[#8b5a2b]/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#8b5a2b] via-[#00ff88] to-[#cd853f] rounded-full flex items-center justify-center shadow-xl shadow-[#8b5a2b]/40">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                      <p className="text-[#d2a679] text-lg">Demo Video Coming Soon</p>
                      <p className="text-[#8b5a2b] text-sm mt-2">
                        Experience real-time sync, analytics, and seamless operations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { icon: Zap, label: "Real-time Sync" },
                    { icon: TrendingUp, label: "Live Analytics" },
                    { icon: Shield, label: "Secure Payments" }
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-[#2c1810]/60 rounded-xl border border-[#8b5a2b]/30"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8b5a2b] to-[#00ff88] rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[#f5deb3] text-sm font-medium">{feature.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => {
                      setShowDemoModal(false);
                      navigate('/choose-subscription');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8b5a2b] via-[#00ff88] to-[#cd853f] text-white rounded-xl font-semibold shadow-lg shadow-[#8b5a2b]/40 hover:shadow-xl hover:shadow-[#00ff88]/50 transition-all hover:scale-105"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => setShowDemoModal(false)}
                    className="px-6 py-3 bg-[#2c1810]/80 backdrop-blur-xl text-[#f5deb3] rounded-xl font-semibold border border-[#8b5a2b]/40 hover:border-[#00ff88]/60 transition-all hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <section className="relative z-10 py-16 px-6 bg-gradient-to-r from-[#2c1810]/80 via-[#3d2817]/70 to-[#2c1810]/80 border-y border-[#8b5a2b]/30">
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
                <div className="text-4xl font-bold bg-gradient-to-r from-[#cd853f] via-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-[#e8c39e] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" ref={featuresRef} className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#8b5a2b]/20 to-[#00ff88]/20 border border-[#8b5a2b]/40 rounded-full text-sm font-medium mb-6">
              <span className="bg-gradient-to-r from-[#cd853f] to-[#00ff88] bg-clip-text text-transparent">
                Features that matter
              </span>
            </span>
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-[#f5deb3]">Built for</span>{' '}
              <span className="bg-gradient-to-r from-[#8b5a2b] via-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                Performance
              </span>
            </h2>
            <p className="text-xl text-[#e8c39e] max-w-2xl mx-auto">
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
                className="group relative bg-[#3d2817]/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-[#8b5a2b]/40 hover:shadow-2xl hover:shadow-[#8b5a2b]/50 transition-all duration-300"
              >
                {/* Gradient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300`} />
                
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#8b5a2b]/40`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-[#f5f0e8] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#e8c39e] leading-relaxed">
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
            className="relative bg-gradient-to-br from-[#8b5a2b] via-[#cd853f] to-[#d2691e] rounded-[3rem] p-16 overflow-hidden shadow-2xl shadow-[#8b5a2b]/50"
          >
            {/* Animated Background Pattern - African-inspired */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <pattern id="ctaPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" />
                  <path d="M 30 20 L 35 30 L 30 40 L 25 30 Z" fill="white" opacity="0.5" />
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
                  className="px-10 py-5 bg-white text-[#8b5a2b] rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={() => setShowDemoModal(true)}
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
      <footer className="relative z-10 bg-gradient-to-br from-[#2c1810] via-[#1a0f08] to-[#0d0604] py-12 px-6 border-t border-[#8b5a2b]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8b5a2b] via-[#00ff88] to-[#cd853f] rounded-xl flex items-center justify-center shadow-lg shadow-[#8b5a2b]/40">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#f5deb3] via-[#00ff88] to-[#ff6b35] bg-clip-text text-transparent">
                PosiFine
              </span>
            </div>

            <p className="text-[#e8c39e] text-sm">
              © 2026 Mabrixel Technologies. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-[#e8c39e]">
              <button onClick={() => navigate('/choose-subscription')} className="hover:text-[#f5deb3] transition-colors">
                Pricing
              </button>
              <button onClick={() => navigate('/auth/login')} className="hover:text-[#f5deb3] transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
