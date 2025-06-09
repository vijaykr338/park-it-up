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
// import { Linkedin, Instagram, Facebook, Mail } from "lucide-react"
import { FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaFacebookF, FaRegEnvelopeOpen, FaGooglePlay } from "react-icons/fa"

import "./app.css"
import { FaEnvelopeCircleCheck, FaEnvelopeOpen, FaLinkedinIn, FaRegEnvelope } from "react-icons/fa6"

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
    <div className="min-h-screen bg-[#181c23]">
      {/* Nav bar */}
      <nav className="fixed top-0 w-full bg-[#232834] backdrop-blur-md z-50 border-b border-blue-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-400">PARK it up</div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors">
                How it works
              </a>
              <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                Contact
              </a>
              <a href="#blog" className="text-gray-400 hover:text-blue-400 transition-colors">
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
              <Badge className="mb-6 bg-[#232834] text-yellow-400 border-yellow-900">
                #1 best parking app 2024 🏆
              </Badge>

              <h1 ref={mainTextRef} className="text-5xl lg:text-7xl font-bold text-gray-100 mb-6 leading-tight wipe-up">
                THE SOLUTION TO YOUR PARKING PROBLEMS
              </h1>

              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                The mobile parking app that is integrated with GPS that can make it easier for you to find the nearest
                parking lot with a variety of price ranges.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input placeholder="Search parking areas..." className="search-input pl-12 w-full bg-[#232834] text-gray-100 border-blue-900" />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input placeholder="Nearby access location..." className="search-input pl-12 w-full bg-[#232834] text-gray-100 border-blue-900" />
                </div>
                <Button className="cta-button px-8 bg-blue-700 text-white hover:bg-blue-800">Get Access</Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>No spam email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>24/7 support system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-yellow-400" />
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

                <div className="absolute top-20 right-20 pricing-badge bg-blue-900 text-white">$2.1/h</div>
                <div className="absolute top-40 left-16 pricing-badge bg-blue-900 text-white">$3.2/h</div>
                <div className="absolute bottom-32 right-32 pricing-badge bg-blue-900 text-white">$2.0/h</div>
                <div className="absolute bottom-20 left-20 pricing-badge bg-blue-900 text-white">$5.0/h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="stats-section py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-gray-100">
              <h2 className="text-2xl font-bold mb-4">
                There are systems that offer nearby listings and competitive prices
              </h2>
              <p className="mb-2">Curious about new developments and updates?<br />Follow our social media</p>
              <div className="flex space-x-4">
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white"><FaLinkedin className="w-6 h-6" /></a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-white"><FaInstagram className="w-6 h-6" /></a>
                <a href="https://facebook.com" className="text-gray-400 hover:text-white"><FaFacebook className="w-6 h-6" /></a>
                <a href="mailto:email@example.com" className="text-gray-400 hover:text-white"><FaEnvelope className="w-6 h-6" /></a>
              </div>
            </div>

            <div className="stat-item text-center">
              <div className="text-6xl font-bold text-blue-200 mb-2">99%</div>
              <p className="text-blue-100">Accurate data based on our system</p>
            </div>

            <div className="stat-item text-center">
              <div className="text-6xl font-bold text-blue-200 mb-2">570k+</div>
              <p className="text-blue-100">Users who are actively using the application</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-20 bg-[#232834]">
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
              <Badge className="mb-6 bg-blue-900 text-blue-200">Our best features for you 💎</Badge>

              <h2 className="text-4xl font-bold text-gray-100 mb-6">THE SOLUTION TO YOUR PARKING PROBLEMS</h2>

              <p className="text-lg text-gray-400 mb-8">
                We are aware that many people have difficulty finding a parking space. We made a feature that can
                certainly solve your parking problems so far
              </p>

              <div className="grid gap-6">
                <Card className="feature-card p-6 bg-[#232834] border-blue-900">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Well organized information</h3>
                        <p className="text-gray-400">Clear and structured parking data for easy decision making</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="feature-card p-6 bg-[#232834] border-blue-900">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Google maps integration</h3>
                        <p className="text-gray-400">Seamless navigation with real-time location tracking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="feature-card p-6 bg-[#232834] border-blue-900">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Integrate with car sensor</h3>
                        <p className="text-gray-400">Smart connectivity with your vehicle for automated parking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button className="mt-8 bg-blue-900 text-white hover:bg-blue-800 px-8 py-3 rounded-full">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#181c23] text-gray-400 py-12 border-t border-blue-900">
        <div className="container mx-auto px-2">
          <div className="grid md:grid-cols-4 gap-6 text-sm align-center">
            <div>
              <h3 className="text-shadow-white font-bold text-lg mb-4">PARK It Up</h3>
              <p className="mb-2">Curious about new developments and updates?<br />Follow our social media</p>
              <div className="flex space-x-4 mt-4">
                <a href="https://www.linkedin.com/company/park-it-up/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedinIn className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaGooglePlay className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-shadow-white font-bold text-lg mb-4">ADDRESS</h3>
              <p className="mb-2">Delhi Technological University,<br />Delhi, India -110042</p>
            </div>
            <div>
              <h3 className="text-shadow-white font-bold text-lg mb-4">CONTACT US</h3>
              <p className="mb-2">
                <a href="tel:+919757050071" className="hover:text-white">+91 9757050071</a>
              </p>
              <p className="mb-2">
                <a href="tel:+917977246237" className="hover:text-white">+91 7977246237</a>
              </p>
              <p className="mb-2">
                <a href="mailto:pranjalchaurasia_23se113@dtu.ac.in" className="hover:text-white">pranjalchaurasia_23se113@dtu.ac.in</a>
              </p>
            </div>
            <div>
              <h3 className="text-shadow-white font-bold text-lg mb-4">OUR POLICIES</h3>
              <p className="mb-2"><a href="#" className="hover:text-white transition-colors mb-2">Privacy Policy</a></p>
              <p className="mb-2"><a href="#" className="hover:text-white transition-colors mb-2">Term of Use</a></p>
              <p className="mb-2"><a href="#" className="hover:text-white transition-colors mb-2">Term of Order</a></p>
            </div>
          </div>
          <div className="text-center mt-10 pt-4 border-t border-blue-900">
            <p className="text-gray-600 text-sm pt-2">© 2025 PARK It Up. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
// hello