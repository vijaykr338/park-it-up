"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ParkitUp from '@/components/assets/Parkitup_logo.png';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[#141a24] w-full top-0 backdrop-blur-md z-50">
      <div className="max-w-7xl container mx-auto px-4 py-4">
        <div className="flex items-center justify-between object-contain h-9">
          <div className="text-2xl font-bold text-blue-400 ">
            {/* PARK It Up */}
            <Image src={ParkitUp} alt='ParkitUp_Logo' 
            height={300} 
            width={300} 
            className='h-18 w-auto'/>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              How it works
            </a>
            <a href="#features" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              About Us
            </a>
            <a href="/contact" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              Contact
            </a>
            <a href="#blog" className="text-gray-100 hover:text-[#4d84a4] transition-colors">
              Services
            </a>
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
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
