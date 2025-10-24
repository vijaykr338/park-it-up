"use client"

import React from "react"
import { FileText, CheckCircle, AlertTriangle, Handshake } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />
      <div className=" bg-[#0a121a] text-gray-100 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Please read these Terms & Conditions carefully before using PARK It Up.
            </p>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section
              icon={<FileText className="w-6 h-6 text-blue-400" />}
              title="Acceptance of Terms"
              text="By accessing or using PARK It Up, you agree to comply with these terms."
            />
            <Section
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
              title="User Responsibilities"
              text="Users must provide accurate information and follow app guidelines."
            />
            <Section
              icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
              title="Limitations of Liability"
              text="DIGIPARK is not responsible for issues caused by misuse or third-party services."
            />
            <Section
              icon={<Handshake className="w-6 h-6 text-purple-400" />}
              title="Modifications"
              text="We reserve the right to update or modify these terms at any time."
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

