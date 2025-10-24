"use client"

import React from "react"
import { Grid, MapPin, Award, Users } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function LearnMore() {
    return (
        <>
            <Navbar />
            <section className="bg-[#0a121a] text-gray-100 flex flex-col items-center justify-center px-6 py-16">
                <div className="max-w-5xl w-full text-center space-y-10">
                    {/* Top Button */}
                    <button className="px-5 py-2 bg-gray-800 rounded-full text-3xl flex items-center gap-2 mx-auto hover:bg-gray-700 transition">
                        Learn More <span role="img" aria-label="person">🧑‍💻</span>
                    </button>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold">
                            LEARN MORE ABOUT PARK It Up
                        </h1>
                        <p className="text-gray-400 max-w-3xl mx-auto">
                            A new innovation in the field of parking apps, PARK It Up was created
                            to help you find parking spaces more easily by providing a variety
                            of features.
                            <br />Let&apos;s find out more about the features and achievements of
                            PARK It Up below.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-10">
                        <Feature
                            icon={<Grid className="w-10 h-10 text-blue-400" />}
                            title="Well organized layout"
                            text="The app design is structured and easy to understand."
                        />
                        <Feature
                            icon={<MapPin className="w-10 h-10 text-green-400" />}
                            title="GPS integration"
                            text="Find parking locations more efficiently."
                        />
                        <Feature
                            icon={<Award className="w-10 h-10 text-yellow-400" />}
                            title="Award-winning"
                            text="This app has won several prestigious awards."
                        />
                        <Feature
                            icon={<Users className="w-10 h-10 text-purple-400" />}
                            title="Active user base"
                            text="Used by hundreds of thousands of people."
                        />
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

function Feature({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode
    title: string
    text: string
}) {
    return (
        <div className="flex flex-col items-center text-center space-y-3">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm">{text}</p>
        </div>
    )
}
