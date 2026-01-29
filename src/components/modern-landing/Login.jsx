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
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-white via-[#f5f7fb] to-white">
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
              className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 mb-6"
            >
              🔐 Secure Access
            </motion.span>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Welcome Back
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
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
                  className="flex items-center gap-3 text-slate-700"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-[#2d4cff] to-[#22c55e] rounded-full" />
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
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-slate-200"
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
                  className="w-16 h-16 bg-gradient-to-br from-[#2d4cff] via-[#3b82f6] to-[#22c55e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <LogIn className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Login to Dashboard
                </h3>
                <p className="text-sm text-slate-600">
                  Enter your credentials to continue
                </p>
              </div>

              <div className="space-y-5">
                {/* Username Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-[#2d4cff] focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-[#2d4cff] focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#2d4cff] via-[#3b82f6] to-[#22c55e] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/choose-subscription')}
                      className="text-[#2d4cff] font-bold hover:text-[#3b82f6] transition-colors"
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
