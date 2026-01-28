import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#fef8f0] rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#6b4c3b] hover:bg-white shadow-lg transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <div className="bg-gradient-to-r from-[#6b4c3b] via-[#8b5a2b] to-[#cd853f] p-8 text-white">
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
                  <h3 className="text-2xl font-bold">Product Demo</h3>
                </div>
                <p className="text-white/90">
                  See how PosiFine transforms your business in under 3 minutes
                </p>
              </div>

              {/* Video Container */}
              <div className="p-6">
                <div className="relative bg-gradient-to-br from-[#8b5a2b] to-[#6b4c3b] rounded-2xl overflow-hidden shadow-xl aspect-video">
                  {/* Video Embed */}
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="PosiFine Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {/* Fallback: If video doesn't load */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#6b4c3b] to-[#8b5a2b] text-white pointer-events-none">
                    <div className="text-center">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-white/70">Loading demo video...</p>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {[
                    { label: "AI Insights", icon: "🤖" },
                    { label: "Real-Time Sync", icon: "⚡" },
                    { label: "Mobile Ready", icon: "📱" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="font-semibold text-[#6b4c3b]">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-[#6b4c3b] via-[#8b5a2b] to-[#cd853f] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Your Free Trial
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
