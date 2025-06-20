import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoCall, IoLocation } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

export default function ContactPage(
{
  className,
  ...props
}: React.ComponentProps<"div">
) {
  return (
    <div className="bg-[#141a24] text-white p-5 pl-20 w-full">
        <div className="text-center mb-10">
           <h1 className="text-7xl font-bold">CONTACT US</h1>
             <h3 className="text-gray-400 pt-3 max-w-xl mx-auto text-2xl">
                Have a question or need assistance? Let us know by filling out the form below.
             </h3>
    </div>
        <form>
            <div className="pt-10 flex flex-col md:flex-row gap-10">
             {/* Left: Form */}
                  <div className="flex flex-col gap-4 w-full md:w-1/2">
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
                    <div className="flex flex-col gap-6 text-white w-full md:w-1/2">
                        <div className="flex items-start gap-3">
                             <IoCall className="text-[30px]" />
                        <div>
                             <h3 className="text-2xl">Call us</h3>
                                <p className="text-gray-400 cursor-pointer">+91 9757050071</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                             <MdOutlineEmail className="text-[30px]" />
                    <div>
                            <h3 className="text-2xl">Email us</h3>
                               <p className="text-gray-400 cursor-pointer">parkitup@gmail.com</p>
                    </div>
                    </div>

                    <div className="flex items-start gap-3">
                              <IoLocation className="text-[30px]" />
                    <div>
                            <h3 className="text-2xl">Visit us</h3>
                                <p className="text-gray-400 cursor-pointer">
                                Delhi Technological University, Delhi, India - 110042
                                </p>
                    </div>
                    </div>
          </div>
        </div>
      </form>
    </div>
  );
}
