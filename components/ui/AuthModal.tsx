'use client';

import React from "react";
import { FaTimes, FaUser, FaLock } from "react-icons/fa";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#181c23] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-[#374151]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <FaLock className="text-[#60a5fa] text-xl" />
            <h2 className="text-xl font-semibold text-[#e2e8f0]">
              Sign In Required
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#374151] rounded-full transition-colors text-[#9ca3af] hover:text-[#e2e8f0]"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#60a5fa]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-[#60a5fa] text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">
              Ready to Book Your Spot?
            </h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Join thousands of drivers who save time and money with PARK It Up. 
              Create your account to book parking spots instantly.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-[#60a5fa] rounded-full"></div>
              <span className="text-[#e2e8f0]">Instant booking confirmation</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-[#60a5fa] rounded-full"></div>
              <span className="text-[#e2e8f0]">Secure payment processing</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-[#60a5fa] rounded-full"></div>
              <span className="text-[#e2e8f0]">Free cancellation available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/signup" className="block">
              <button 
                onClick={onClose}
                className="w-full bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-semibold py-3 rounded-xl text-base transition-colors duration-200"
              >
                Create Account
              </button>
            </Link>
            
            <Link href="/login" className="block">
              <button 
                onClick={onClose}
                className="w-full bg-transparent border border-[#374151] hover:bg-[#374151] text-[#e2e8f0] font-semibold py-3 rounded-xl text-base transition-colors duration-200"
              >
                Sign In
              </button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-[#94a3b8]">
              By continuing, you agree to our{" "}
              <Link href="/term-of-use" className="text-[#60a5fa] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/term-of-order" className="text-[#60a5fa] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}