"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ParkitUp from '@/components/assets/Parkitup_logo.png';
// import parkituptext from '@/components/assets/park-it-up.jpg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const navLinks = [
    {
      name: 'How it works',
      href: '#how-it-works',
    },
    {
      name: 'Features',
      href: '#features',
    },
    {
      name: 'About Us',
      href: '/about',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
    {
      name: 'Services',
      href: '#services',
    }
  ]
  return (
    <nav className="bg-[#0a121a] w-full top-0 backdrop-blur-md z-50">
      <div className="max-w-7xl container mx-auto px-4 py-4">
        <div className="flex items-center justify-between object-contain h-9">
          <Link href='/'>
            <div className="text-2xl font-bold text-blue-400 flex items-center space-x-3">
              <Image src={ParkitUp} alt='ParkitUp_Logo'
                height={300}
                width={300}
                className='h-18 w-auto' />
              <span className='hidden md:block text-white font-bold'>PARK It Up</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = (pathname ?? '') === link.href || ((pathname ?? '').startsWith(link.href) && link.href !== '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${isActive ? "text-[#4d84a4] transition-colors" : "text-gray-100 hover:text-[#4d84a4] transition-colors"}`}
                >
                  {link.name}
                </Link>
              );
            })}
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
