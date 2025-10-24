"use client"

import React from "react"
import { Battery, Droplets, Car, Circle } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function Services() {
    return (
        <>
            <Navbar />
            <section className="bg-[#0a121a] text-gray-100 flex flex-col items-center justify-center px-6 py-16">
                <div className="max-w-6xl w-full text-center space-y-12">
                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold">
                            EXPAND YOUR AUTOMOTIVE SUPPORT NEEDS
                        </h1>
                        <p className="text-gray-400 max-w-3xl mx-auto">
                            Provides a large selection of services that can assist you with
                            your automotive support problems, which you can order easily
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <ServiceCard
                            icon={<Battery className="w-10 h-10 text-blue-400" />}
                            title="Battery Check"
                            text="Make sure the battery is in good condition so that vehicle can run normally"
                        />
                        <ServiceCard
                            icon={<Car className="w-10 h-10 text-green-400" />}
                            title="Car Wash"
                            text="Clean the vehicle from various debris which can be done at your place"
                        />
                        <ServiceCard
                            icon={<Droplets className="w-10 h-10 text-yellow-400" />}
                            title="Oil Change"
                            text="Ensure the volume and quality of oil in good condition by draining it"
                        />
                        <ServiceCard
                            icon={<Circle className="w-10 h-10 text-purple-400" />}
                            title="Tire Replacement"
                            text="Replace the car tires with new ones to get better performance"
                        />
                    </div>

                    {/* Bottom Button */}
                    <button className="mt-10 px-6 py-3 border border-gray-500 rounded-full hover:bg-gray-800 transition">
                        See All Services
                    </button>
                </div>
            </section>
            <Footer />
        </>
    )
}

function ServiceCard({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode
    title: string
    text: string
}) {
    return (
        <div className="bg-gray-900 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:bg-gray-800 transition">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm">{text}</p>
        </div>
    )
}
