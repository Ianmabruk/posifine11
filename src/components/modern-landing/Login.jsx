import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/auth/login');
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#f5efe6] via-[#fef8f0] to-[#f5efe6]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-white border border-[#cd853f]/30 rounded-full text-sm font-semibold text-[#6b4c3b] mb-6"
            >
              🔐 Secure Access
            </motion.span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#6b4c3b] mb-6">
              Welcome Back
            </h2>
            <p className="text-lg text-[#8b5a2b] mb-8 leading-relaxed">
              Log in to your dashboard to manage your business, track sales, and access AI-powered insights.
            </p>

            <div className="space-y-4">
              {[
                "✓ Secure bank-level encryption",
                "✓ Access from any device",
                "✓ Real-time synchronization",
                "✓ 24/7 customer support"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-[#6b4c3b]"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00ff88] to-[#8b5a2b] rounded-full" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-[#cd853f]/10"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-[#6b4c3b] via-[#8b5a2b] to-[#cd853f] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <LogIn className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#6b4c3b] mb-2">
                  Login to Dashboard
                </h3>
                <p className="text-sm text-[#8b5a2b]">
                  Enter your credentials to continue
                </p>
              </div>

              <div className="space-y-5">
                {/* Username Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#6b4c3b] mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b5a2b]" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[#fef8f0] border-2 border-[#cd853f]/20 rounded-2xl focus:border-[#8b5a2b] focus:outline-none transition-all text-[#6b4c3b] placeholder:text-[#8b5a2b]/50"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#6b4c3b] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b5a2b]" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[#fef8f0] border-2 border-[#cd853f]/20 rounded-2xl focus:border-[#8b5a2b] focus:outline-none transition-all text-[#6b4c3b] placeholder:text-[#8b5a2b]/50"
                    />
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-[#8b5a2b] hover:text-[#6b4c3b] font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#6b4c3b] via-[#8b5a2b] to-[#cd853f] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-[#cd853f]/10">
                  <p className="text-sm text-[#8b5a2b]">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/choose-subscription')}
                      className="text-[#6b4c3b] font-bold hover:text-[#8b5a2b] transition-colors"
                    >
                      Sign up free
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
