import React from "react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
// import Logo from "@/components/assets/Parkitup_logo.png";
// import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#071127] text-gray-300 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white">PARK It Up</h2>
          <p className="text-gray-400 mt-2">Curious about new developments and updates?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-auto">
          <div>
            <div className="font-semibold mb-2 text-white">Address</div>
            <div className="text-gray-400 text-sm">811C, AB4, Delhi Technological University, Rohini, Delhi, India</div>
          </div>
          <div>
            <div className="font-semibold mb-2 text-white">Policies</div>
            <ul className="text-gray-400 text-sm space-y-1">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Use</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-white">Contact</div>
            <div className="text-gray-400 text-sm">+91 9560967377<br/>officialparkitup@gmail.com</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-800 pt-4 text-center text-gray-500 text-sm">© 2025 PARK It Up. All rights reserved.</div>
    </footer>
  );
};


export default Footer;
