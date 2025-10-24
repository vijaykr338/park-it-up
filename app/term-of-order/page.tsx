"use client"

import React from "react"
import { ShoppingCart, CreditCard, Truck, RefreshCw, AlertTriangle } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function TermsOfOrder() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a121a] text-gray-100 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Terms of Order</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Please read these Terms of Order carefully before making a purchase
              through PARK It Up. By placing an order, you agree to these terms.
            </p>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section
              icon={<ShoppingCart className="w-6 h-6 text-blue-400" />}
              title="Placing an Order"
              text="Orders must be placed through our official PARK It Up app. Ensure all details provided are accurate to avoid delays or issues."
            />
            <Section
              icon={<CreditCard className="w-6 h-6 text-green-400" />}
              title="Payment"
              text="Payments must be made securely through supported methods. PARK It Up does not store sensitive card details."
            />
            <Section
              icon={<Truck className="w-6 h-6 text-purple-400" />}
              title="Delivery & Fulfillment"
              text="Orders are processed promptly. Delivery timelines may vary depending on service availability."
            />
            <Section
              icon={<RefreshCw className="w-6 h-6 text-yellow-400" />}
              title="Cancellations & Refunds"
              text="Orders can be canceled before processing. Refunds follow our Refund Policy and may take up to 7 business days."
            />
            <Section
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              title="Limitations"
              text="PARK It Up reserves the right to refuse or cancel any order in case of fraudulent activity or policy violations."
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function Section({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-400">{text}</p>
    </div>
  )
}