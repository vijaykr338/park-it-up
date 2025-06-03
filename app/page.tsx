"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Car, Shield, Clock, Users } from "lucide-react"
import "./app.css"

gsap.registerPlugin(ScrollTrigger)

export default function ParkItUpLanding() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const mainTextRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mainTextRef.current) {
        gsap.fromTo(
          mainTextRef.current,
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.5,
          },
        )
      }

      gsap.fromTo(
        ".hero-content > *:not(h1)",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          delay: 1,
          ease: "power2.out",
        },
      )

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          const timestamp = Date.now()
          console.log(`Stats animation triggered at: ${new Date(timestamp).toISOString()}`)

          gsap.fromTo(
            ".stat-item",
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              stagger: 0.2,
              ease: "back.out(1.7)",
            },
          )
        },
      })

      // Features section scroll animation
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.fromTo(
            ".feature-card",
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
            },
          )
        },
      })

      gsap.to(".pricing-badge", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      })
    }, [heroRef, statsRef, featuresRef])

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Nav bar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">PARK it up</div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How it works
              </a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
              <a href="#blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                Blog
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <Button className="nav-button secondary">Sign In</Button>
              <Button className="nav-button">Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="hero-gradient pt-24 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              <Badge className="mb-6 bg-yellow-100 text-yellow-800 border-yellow-200">
                #1 best parking app 2024 🏆
              </Badge>

              <h1 ref={mainTextRef} className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight wipe-up">
                THE SOLUTION TO YOUR PARKING PROBLEMS
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                The mobile parking app that is integrated with GPS that can make it easier for you to find the nearest
                parking lot with a variety of price ranges.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input placeholder="Search parking areas..." className="search-input pl-12 w-full" />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input placeholder="Nearby access location..." className="search-input pl-12 w-full" />
                </div>
                <Button className="cta-button px-8">Get Access</Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No spam email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>24/7 support system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-yellow-500" />
                  <span>Free trial 13 days</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-a4xzprubrLJsXHnBSTihaoo5LP13q5.png"
                  alt="Parking visualization with pricing"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />

                <div className="absolute top-20 right-20 pricing-badge">$2.1/h</div>
                <div className="absolute top-40 left-16 pricing-badge">$3.2/h</div>
                <div className="absolute bottom-32 right-32 pricing-badge">$2.0/h</div>
                <div className="absolute bottom-20 left-20 pricing-badge">$5.0/h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="stats-section py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">
                There are systems that offer nearby listings and competitive prices
              </h2>
            </div>

            <div className="stat-item text-center">
              <div className="text-6xl font-bold text-blue-300 mb-2">99%</div>
              <p className="text-blue-100">Accurate data based on our system</p>
            </div>

            <div className="stat-item text-center">
              <div className="text-6xl font-bold text-blue-300 mb-2">570k+</div>
              <p className="text-blue-100">Users who are actively using the application</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fMxUow09IMWMeIQSbWfJu3tBKqwZSD.png"
                alt="Mobile app interface"
                width={500}
                height={600}
                className="w-full h-auto"
              />
            </div>

            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-800">Our best features for you 💎</Badge>

              <h2 className="text-4xl font-bold text-gray-800 mb-6">THE SOLUTION TO YOUR PARKING PROBLEMS</h2>

              <p className="text-lg text-gray-600 mb-8">
                We are aware that many people have difficulty finding a parking space. We made a feature that can
                certainly solve your parking problems so far
              </p>

              <div className="grid gap-6">
                <Card className="feature-card p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Well organized information</h3>
                        <p className="text-gray-600">Clear and structured parking data for easy decision making</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="feature-card p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Google maps integration</h3>
                        <p className="text-gray-600">Seamless navigation with real-time location tracking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="feature-card p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Integrate with car sensor</h3>
                        <p className="text-gray-600">Smart connectivity with your vehicle for automated parking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button className="mt-8 bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-full">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-4">PARK it up</div>
            <p className="text-gray-400 mb-8">Making parking simple and accessible for everyone</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500">© 2024 PARK it up. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
// hello