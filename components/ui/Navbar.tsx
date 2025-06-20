"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ParkitUp from '@/components/assets/Parkitup_logo.png';
// import parkituptext from '@/components/assets/park-it-up.jpg';
import Link from 'next/link';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#141a24] w-full top-0 backdrop-blur-md z-50">
      <div className="max-w-7xl container mx-auto px-4 py-4">
        <div className="flex items-center justify-between object-contain h-9">
          <div className="text-3xl font-bold text-blue-400 flex items-center space-x-4">
            {/* PARK It Up */}
            <Image src={ParkitUp} alt='ParkitUp_Logo'
              height={300}
              width={300}
              className='h-18 w-auto' />
            <span className='hidden md:flex text-white font-bold'>PARK It Up</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#carwash" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              Car Wash
            </Link>
            <Link href="#features" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              About Us
            </a>
            <a href="/contact" className="text-gray-100 hover:text-[#4d84a4] transition-colors">

            </Link>
            <Link href="#contact" className="text-gray-100 hover:text-[#4d84a4] transition-colors">

              Contact
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-100 hover:text-[#4d84a4] transition-colors"
              >
                Services
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-10">
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    How It Works
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Help
                  </Link>
                </div>
              )}
            </div>

          </div>

          <div className="flex items-center space-x-3">
            <Button className="bg-white text-[#4d84a4] rounded-full hover:bg-[#4d84a4] hover:text-white cursor-pointer">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button className="bg-[#4d84a4] rounded-full hover:bg-white cursor-pointer hover:text-[#4d84a4]" >
              <Link href='/signup'>
                Sign Up
              </Link>
            </Button>

            {/* Right Side - Auth/Profile */}
            {/* Profile Button */}
            {/* <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-[#232834]"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://imgs.search.brave.com/6lqh3FAE6njbdfwZ_bSyVWQi24L-AncLO64V3Qw_IDw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzEyL2Zh/LzgxLzEyZmE4MTEw/MGY1NGQ3NGMwMzI5/ZDIwNmNkMDJmMzli/LmpwZw" alt="Profile" />
                    <AvatarFallback className="bg-[#4a90a4] text-white text-sm">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
