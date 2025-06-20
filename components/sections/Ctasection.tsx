import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { Search, MapPin, Car } from 'lucide-react';
import Image from 'next/image';
import Mock1 from '@/components/assets/phone_mockup1.png';
import Mock2 from '@/components/assets/phone_mockup2.png';

const Ctasection = () => {
    return (
        <section className="bg-[#0a121a] py-16 overflow-hidden">
            <div className="container mx-auto p-10 object-contain">
                <div className="bg-[#4d84a4] rounded-2xl p-8 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center object-contain">
                            <div className="text-center lg:text-left relative z-10">                                <Badge className="mb-6 bg-[#38708d] text-white rounded-full px-4 py-1">
                                    App Coming Soon 🚀
                                </Badge>

                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                    BE PART OF THE FUTURE PARKING ERA NOW
                                </h2>

                                <p className="text-md text-white/80 mb-8 max-w-lg">
                                    Be the first to experience the future of parking. Sign up now to get notified when PARK It Up launches.
                                </p>

                                <div className="flex items-center mb-8 max-w-md mx-auto lg:mx-0 bg-[#232834] rounded-full p-1">
                                    <Input
                                        placeholder="Enter your email"
                                        className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-100 h-12"
                                    />                                    <Button className="px-8 h-12 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
                                        Get Notified
                                    </Button>
                                </div>
                            </div>

                            {/* Phone Mockups */}
                            <div className="relative h-[500px] lg:h-[600px] overflow-visible hidden lg:block">
                                <div className="overflow-hidden absolute bottom-0 right-0 w-[350px] h-[600px] transform translate-x-20 translate-y-24">
                                    <Image
                                        src={Mock2}
                                        alt="Mockup2"
                                        height={600}
                                        width={300}
                                        className="absolute bottom-0 right-10 transform translate-x-14 translate-y-10 h-[600px] object-contain z-10"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative lg:block hidden">
                    <Image
                        src={Mock1}
                        alt="Mockup1"
                        height={650}
                        width={300}
                        className="absolute transform z-20 -left-30 lg:translate-x-200 lg:-translate-y-190 object-contain"
                        priority
                    />
                </div>
            </div>
        </section>
    )
}

export default Ctasection