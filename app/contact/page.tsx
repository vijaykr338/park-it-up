import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoCall, IoLocation } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

export default function ContactPage() {
  return (
    <div className="bg-[#141a24] text-white p-5 sm:p-10 lg:pl-20 w-full">
        <div className="text-center mb-10">
           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">CONTACT US</h1>
             <h3 className="text-gray-400 pt-3 max-w-xl mx-auto text-lg sm:text-xl md:text-2xl px-4">
                Have a question or need assistance? Let us know by filling out the form below.
             </h3>
    </div>
        <form>
            <div className="pt-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
             {/* Left: Form */}
                  <div className="flex flex-col gap-4 w-full lg:w-1/2">
                      <Input id="name" type="text" placeholder="Name" required className="bg-[#1e1e24]" />
                      <Input id="email" type="email" placeholder="Email" required className="bg-[#1e1e24]" />
                      <Input id="subject" type="text" placeholder="Subject" required  className="bg-[#1e1e24]"/>
                      <Input id="message" type="text" placeholder="Message" required className="h-[70px] text-start bg-[#1e1e24]" />
                      <Button
                        type="submit"
                          className="w-full bg-[#4d84a4] hover:bg-slate-700 border border-white "
                      >
                        Send Message
                      </Button>
            </div>

            {/* Right: Contact Info */}
                    <div className="flex flex-col gap-6 text-white w-full lg:w-1/2">
                        <div className="flex items-start gap-3">
                             <IoCall className="text-[24px] sm:text-[30px] flex-shrink-0" />
                        <div>
                             <h3 className="text-xl sm:text-2xl">Call us</h3>
                                <p className="text-gray-400 cursor-pointer text-sm sm:text-base">+91 9560967377</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                             <MdOutlineEmail className="text-[24px] sm:text-[30px] flex-shrink-0" />
                    <div>
                            <h3 className="text-xl sm:text-2xl">Email us</h3>
                               <p className="text-gray-400 cursor-pointer text-sm sm:text-base">officialparkitup@gmail.com</p>
                    </div>
                    </div>

                    <div className="flex items-start gap-3">
                              <IoLocation className="text-[24px] sm:text-[30px] flex-shrink-0" />
                    <div>
                            <h3 className="text-xl sm:text-2xl">Visit us</h3>
                                <p className="text-gray-400 cursor-pointer text-sm sm:text-base">
                                811C, AB4, Delhi Technological University, Rohini, Delhi, India
                                </p>
                    </div>
                    </div>
          </div>
        </div>
      </form>
    </div>
  );
}
