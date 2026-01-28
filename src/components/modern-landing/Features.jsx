import { motion } from "framer-motion";
import { Sparkles, Activity, Shield, TrendingUp, Package, Users, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Forecasting",
      description: "GPT-4 powered sales predictions and intelligent business insights",
      badge: "NEW",
      gradient: "from-[#8b5a2b] via-[#00ff88] to-[#cd853f]"
    },
    {
      icon: Package,
      title: "Intelligent Inventory",
      description: "Track products and stock levels with AI-powered predictions",
      gradient: "from-[#cd853f] to-[#8b5a2b]"
    },
    {
      icon: Activity,
      title: "Real-Time Sync",
      description: "Monitor daily and monthly sales across all devices instantly",
      gradient: "from-[#8b5a2b] to-[#00ff88]"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Detailed charts & reports with predictive insights",
      gradient: "from-[#cd853f] to-[#d2691e]"
    },
    {
      icon: TrendingUp,
      title: "Growth Optimization",
      description: "AI-driven insights to boost revenue automatically",
      badge: "PRO",
      gradient: "from-[#8b5a2b] to-[#cd853f]"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Enterprise-grade encryption and role-based access",
      gradient: "from-[#d2691e] to-[#8b5a2b]"
    },
    {
      icon: Users,
      title: "Staff Performance",
      description: "Automated performance analysis and coaching",
      gradient: "from-[#cd853f] to-[#8b5a2b]"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#f5efe6] via-[#fef8f0] to-[#f5efe6]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-white border border-[#cd853f]/30 rounded-full text-sm font-semibold text-[#6b4c3b] mb-4"
          >
            ✨ Powerful Features
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#6b4c3b] mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-[#8b5a2b] max-w-2xl mx-auto">
            Built with cutting-edge AI technology to give your business the competitive edge
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px rgba(107, 76, 59, 0.2)"
              }}
              className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#cd853f]/10"
            >
              {/* Badge */}
              {feature.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#00ff88] to-[#8b5a2b] text-white text-xs font-bold rounded-full">
                  {feature.badge}
                </div>
              )}

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#6b4c3b] mb-3 group-hover:text-[#8b5a2b] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#8b5a2b] leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Gradient Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Response Time" },
            { value: "10K+", label: "Businesses" },
            { value: "24/7", label: "Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white to-[#f5efe6] rounded-2xl p-6 text-center shadow-lg border border-[#cd853f]/10"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6b4c3b] to-[#cd853f] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[#8b5a2b] font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
