import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "$29",
      description: "Perfect for small shops",
      features: [
        "Single User",
        "Basic Inventory",
        "Sales Tracking",
        "Email Support",
        "Mobile App"
      ],
      highlight: false,
      icon: Zap,
      gradient: "from-[#8b5a2b] to-[#cd853f]"
    },
    {
      name: "Ultra",
      price: "$99",
      description: "For growing businesses",
      features: [
        "Up to 10 Users",
        "Advanced Inventory",
        "Analytics Dashboard",
        "Priority Support",
        "API Access",
        "Custom Reports"
      ],
      highlight: false,
      icon: Sparkles,
      gradient: "from-[#cd853f] to-[#d2691e]"
    },
    {
      name: "Pro",
      price: "$199",
      description: "Ultimate business solution",
      features: [
        "Unlimited Users",
        "AI Forecasting",
        "Staff Performance",
        "24/7 VIP Support",
        "White Label",
        "Custom Integrations",
        "Dedicated Manager"
      ],
      highlight: true,
      badge: "MOST POPULAR",
      icon: Crown,
      gradient: "from-[#6b4c3b] via-[#00ff88] to-[#cd853f]"
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#fef8f0] via-[#f5efe6] to-[#fef8f0]">
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
            💎 Simple Pricing
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#6b4c3b] mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-[#8b5a2b] max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-br from-[#6b4c3b] via-[#8b5a2b] to-[#cd853f] text-white shadow-2xl scale-105 md:scale-110 z-10"
                  : "bg-white shadow-xl hover:shadow-2xl"
              }`}
            >
              {/* Most Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#00ff88] to-[#8b5a2b] text-white text-xs font-bold rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              {/* Glow Effect for Highlighted Plan */}
              {plan.highlight && (
                <>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#00ff88] to-[#cd853f] opacity-20 blur-xl animate-pulse" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88] via-[#cd853f] to-[#8b5a2b] rounded-3xl opacity-30 blur-md animate-pulse" />
                </>
              )}

              <div className="relative">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                    plan.highlight ? "bg-white/20" : ""
                  }`}
                >
                  <plan.icon className={`w-8 h-8 ${plan.highlight ? "text-white" : "text-white"}`} />
                </motion.div>

                {/* Plan Name */}
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.highlight ? "text-white" : "text-[#6b4c3b]"
                }`}>
                  {plan.name}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-6 ${
                  plan.highlight ? "text-white/90" : "text-[#8b5a2b]"
                }`}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className={`text-5xl font-bold ${
                    plan.highlight ? "text-white" : "text-[#6b4c3b]"
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ml-2 ${
                    plan.highlight ? "text-white/80" : "text-[#8b5a2b]"
                  }`}>
                    /month
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? "text-[#00ff88]" : "text-[#00ff88]"
                      }`} />
                      <span className={
                        plan.highlight ? "text-white" : "text-[#6b4c3b]"
                      }>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/choose-subscription')}
                  className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all ${
                    plan.highlight
                      ? "bg-white text-[#6b4c3b] hover:shadow-2xl hover:bg-[#fef8f0]"
                      : "bg-gradient-to-r from-[#6b4c3b] to-[#8b5a2b] text-white hover:shadow-2xl"
                  }`}
                >
                  Start Free Trial
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-[#8b5a2b] mb-6">
            Join thousands of businesses already using PosiFine
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-[#6b4c3b] font-semibold">Trusted by 10K+ businesses</div>
            <div className="text-[#6b4c3b] font-semibold">⭐⭐⭐⭐⭐ 4.9/5 rating</div>
            <div className="text-[#6b4c3b] font-semibold">99.9% uptime guaranteed</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
