"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SuccessToasterProps {
  open: boolean;
  onClose?: () => void;
  message?: string;
}

export default function SuccessToaster({ open, onClose, message = "Reservation Confirmed!" }: SuccessToasterProps) {
  const router = useRouter();
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose?.();
        router.push("/my-reservation");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, router]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-4 p-8 rounded-xl bg-[#082235] shadow-2xl"
          >
            <motion.svg
              width="80" height="80" viewBox="0 0 80 80"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <circle cx="40" cy="40" r="38" fill="#18a0ff" />
              <motion.path
                d="M25 40l13 13 17-21"
                stroke="#fff"
                strokeWidth="5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }}
              />
            </motion.svg>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white"
            >
              {message}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-base text-blue-200 text-center"
            >
              Your parking spot is reserved.<br />Redirecting to your reservation...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
