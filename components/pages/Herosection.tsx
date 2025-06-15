import React from 'react'
import Image from "next/image"
import { Search, CircleCheckBig } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ParkVisual from '@/components/assets/hero.png'

const Herosection = () => {
    return (
        // <section ref={heroRef} className=" pt-24 pb-16 min-h-screen flex items-center">
        <section className="w-full pb-20 bg-[#141a24]">
            <div className="max-w-7xl container mx-auto flex items-center relative px-4 py-12 lg:py-0">
                <div className="grid lg:grid-cols-2 items-center gap-8">
                    <div className="hero-content">
                        <Badge className="mb-6 bg-[#262a34] text-sm rounded-full font-semibold flex items-center justify-center">
                            #Now in Delhi 🏙️
                        </Badge>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient mb-6 leading-tight wipe-up">
                            In a Hurry? <br/>
                            Just Park it Up!
                        </h1>

                        <p className="text-md text-gradient2 mb-8 leading-tight w-full lg:w-2/3">
                            The mobile parking app that is integrated with GPS that it can
                            make it easier for you to find the nearest parking lot with a variety 
                            of price ranges.
                        </p>

                        <div className="flex items-center gap-2 mb-8 w-full lg:w-3/4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input placeholder="Search for parking..." className="search-input pl-12 w-full rounded-full h-12 bg-[#232834] text-gray-100 border-[#4d84a4]" />
                                <Button className="cta-button absolute right-1 top-1/2 -translate-y-1/2 px-4 sm:px-8 h-10 rounded-full bg-[#4d84a4] text-white hover:bg-blue-400 cursor-pointer">Search</Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <CircleCheckBig className="w-4 h-4 text-[#4d84a4]" />
                                <span>No spam email</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CircleCheckBig className="w-4 h-4 text-[#4d84a4]" />
                                <span>24/7 support system</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CircleCheckBig className="w-4 h-4 text-[#4d84a4]" />
                                <span>Free trial 13 days</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div>
                            <Image
                                src={ParkVisual}
                                alt="Parking visualization"
                                width={600}
                                height={400}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Herosection
