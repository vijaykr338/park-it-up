import React from "react";
import { FaInstagram, FaFacebookF, FaGooglePlay } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import Logo from "@/components/assets/Parkitup_logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#0a121a] text-white py-10 px-4 flex flex-col justify-between h-full">
      <div className="bg-[#232834] rounded-3xl p-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8 py-4 w-full">
            <div className="flex flex-col items-start w-full mx-auto">
              <div className="text-3xl  font-bold">
                <Image
                  src={Logo}
                  alt="ParkitUp Logo"
                  height={50}
                  width={200}
                  className="h-18 w-auto"
                />
              </div>
              <p className="text-gray-400 lg:text-lg text-md mb-4 mt-2">
                Curious about new developments and updates?
              </p>
            </div>

            <div className="flex flex-col items-start md:w-full">
              <div className="font-semibold mb-4 md:mb-6">ADDRESS</div>
              <p className="text-gray-400 text-md">
                Delhi Technological University, Delhi, India -110042
              </p>
            </div>
            <div className="flex flex-row w-full ">
              <div className="flex flex-col items-start w-1/2 md:w-full">
                <div className="font-semibold mb-4 md:mb-6">OUR POLICIES</div>
                <ul className="text-gray-400 text-md space-y-1 flex flex-col gap-1">
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Term of Use</a>
                  </li>
                  <li>
                    <a href="#">Term of order</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start w-full mx-auto">
              <div className="font-semibold mb-4 md:mb-6">CONTACT US</div>
              <ul className="text-gray-400 text-md space-y-1 flex flex-col gap-1">
                <li>
                  <a href="tel:+919757050071">+91 9757050071</a>
                </li>
                <li>
                  <a href="tel:+91797724623">+91 7977246237</a>
                </li>
                <li>
                  <a href="mailto:parkitup@gmail.com">parkitup@gmail.com</a>
                </li>
              </ul>
              <form className="relative w-full mt-4">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-[#2C3444] text-white rounded-full px-4 py-2 w-full pr-28 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full bg-[#4d84a4] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#2B63D9] transition text-sm"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="w-full border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
            <span className="text-gray-400 text-xs text-center w-full md:w-auto">
              © 2025 Park It Up. All rights reserved.
            </span>
            <div className="flex gap-4 mt-2 md:mt-0 justify-center w-full md:w-auto">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaGooglePlay className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
