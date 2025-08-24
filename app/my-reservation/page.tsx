"use client";
import { useDemo } from "../DemoProvider";
import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

const DUMMY_LOT = {
  address: "Pacific Mall, Saket, New Delhi",
  mapUrl: "https://goo.gl/maps/abc123xyz",
};

const DUMMY_CONTACT = {
  email: "guest@example.com",
  phone: "+91 98765 43210",
};

const DUMMY_PAYMENT = {
  type: "card",
  cardNumber: "4242424242424242",
  cardName: "Guest User",
};

const DUMMY_VEHICLE = {
  makeModel: "Honda City",
  licensePlate: "DL4C AB 1234",
  state: "Delhi",
};

export default function MyReservationPage() {
  const { reservations } = useDemo();
  const active = reservations.find(r => r.status === "booked" || r.status === "active");
  const [showCheck, setShowCheck] = useState(true);

  if (!active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a121a] text-white">
        <div className="bg-[#082235] p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">No Active Reservation</h2>
          <p className="text-gray-300">You have no current parking reservations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a121a] text-white">
      <div className="w-full max-w-2xl mx-auto bg-[#082235] p-8 rounded-2xl shadow-2xl">
        {/* Animated checkmark banner */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.svg width="100" height="100" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="38" fill="#18a0ff" />
            <motion.path
              d="M25 40l13 13 17-21"
              stroke="#fff"
              strokeWidth="6"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
          </motion.svg>
          <div className="text-3xl font-bold mt-4 text-white">Reservation Confirmed!</div>
          <div className="text-blue-200 mt-2">Your parking spot is reserved.</div>
        </motion.div>

        {/* Details card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="font-semibold text-lg mb-1">Lot Details</div>
            <div className="text-gray-200">{active.lotName}</div>
            <div className="text-gray-400 text-sm">{DUMMY_LOT.address}</div>
            <a href={DUMMY_LOT.mapUrl} target="_blank" rel="noopener" className="text-blue-400 underline text-sm">Get Directions</a>
            <div className="mt-4 font-semibold text-lg">Reservation Time</div>
            <div className="text-gray-200">{new Date(active.startAt).toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Status: <span className="font-bold text-green-400">{active.status}</span></div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-1">Check-in QR Code</div>
            <QRCodeSVG value={active.id} size={96} bgColor="#082235" fgColor="#18a0ff" />
            <div className="text-xs text-gray-400 mt-2">Show this QR at the parking lot</div>
          </div>
        </div>

        {/* User, payment, vehicle info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="font-semibold text-lg mb-1">Contact Info</div>
            <div className="text-gray-200">{DUMMY_CONTACT.email}</div>
            <div className="text-gray-200">{DUMMY_CONTACT.phone}</div>
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Payment Method</div>
            <div className="text-gray-200">Card ending in {DUMMY_PAYMENT.cardNumber.slice(-4)}</div>
            <div className="text-gray-200">{DUMMY_PAYMENT.cardName}</div>
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Vehicle</div>
            <div className="text-gray-200">{DUMMY_VEHICLE.makeModel}</div>
            <div className="text-gray-200">{DUMMY_VEHICLE.licensePlate} ({DUMMY_VEHICLE.state})</div>
          </div>
        </div>

        {/* Booking fee and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <div className="text-xl font-bold text-white">Booking Fee: ₹{active.bookingFee}</div>
          <div className="flex gap-3">
            <a href="/dashboard" className="bg-[#18a0ff] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#1490e6]">Go to Dashboard</a>
            <a href="/my-reservation/entry" className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-500">Start Session (Entry)</a>
            <a href={`/my-reservation/active?reservationId=${active.id}`} className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-yellow-400">View Active</a>
            <a href={`/my-reservation/exit?reservationId=${active.id}`} className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-400">Exit / Pay</a>
          </div>
        </div>
      </div>
    </div>
  );
}
