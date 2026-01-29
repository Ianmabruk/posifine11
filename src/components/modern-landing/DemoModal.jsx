import { motion, AnimatePresence } from "framer-motion";
import { X, Play, CheckCircle2 } from "lucide-react";

export default function DemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:bg-white shadow-lg transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <div className="bg-gradient-to-r from-[#2d4cff] via-[#3b82f6] to-[#22c55e] p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                  >
                    <Play className="w-5 h-5" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">Choose Subscription</h3>
                </div>
                <p className="text-white/90">
                  Your simple path to a live POS in minutes
                </p>
              </div>

              <div className="p-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <ol className="space-y-4">
                    {[
                      "Choose Subscription",
                      "Access Admin Dashboard",
                      "Add Users",
                      "Cashier Makes Sales"
                    ].map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#22c55e] mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900">{index + 1}. {step}</p>
                          <p className="text-sm text-slate-500">Step {index + 1} in the onboarding flow.</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-[#2d4cff] via-[#3b82f6] to-[#22c55e] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Demo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
