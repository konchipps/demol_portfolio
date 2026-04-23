import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ title, description, open, onClose, children, size = "max-w-3xl" }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`glass-panel relative max-h-[90vh] w-full ${size} overflow-y-auto rounded-lg p-6 sm:p-8`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg border border-white/10 p-2 text-slate-300 transition hover:border-rose-300/30 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
            ) : null}
            <div className="mt-8">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
