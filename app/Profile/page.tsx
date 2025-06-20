import Image from "next/image"
import { Star, MapPin, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import "../app.css"

export default function Component() {
  return (
    <div className="min-h-screen bg-[#141a2] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="w-32 h-32 border-2 border-[#1985df]">
              <AvatarImage src="https://upload.wikimedia.org/wikipedia/en/d/db/Percy_Jackson_Portrait.jpg" alt="Percy Stark" />
              <AvatarFallback className="text-2xl bg-[#232834] text-[#1985df]">PS</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex gap-5 items-center justify-between mb-2">
                <h1 className="text-4xl font-bold mb-2 text-white">Percy Stark</h1>
                <Button className="bg-[#1985df] hover:bg-[#0d47a1] text-white rounded-full px-6 py-3">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-400 text-lg">kingstark@example.com</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#232834] border-[#1985df]/20 border-0">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-3xl font-bold mb-1 text-white">4.8</div>
              <div className="text-[#1985df]">Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-[#232834] border-[#1985df]/20 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-1 text-white">1,257</div>
              <div className="text-[#1985df]">Parking booked</div>
            </CardContent>
          </Card>

          <Card className="bg-[#232834] border-[#1985df]/20 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-1 text-white">517 hr</div>
              <div className="text-[#1985df]">Total hours</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#1985df] uppercase tracking-wide">Personal Information</h2>
            <Card className="bg-[#232834] border-[#1985df]/20 border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Full name</span>
                  <span className="font-medium text-white">Percy Stark</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date of birth</span>
                  <span className="font-medium text-white">July 31, 1990</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Telephone</span>
                  <span className="font-medium text-white">+123 456 7890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="font-medium text-white">Delhi, India</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1985df] uppercase tracking-wide">Vehicle</h2>
              <Button className="bg-[#1985df] hover:bg-[#0d47a1] text-white rounded-full px-4 py-2 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
            <Card className="bg-[#232834] border-[#1985df]/20 border-0">
              <CardContent className="p-6">
                <div className="px-10 flex items-center gap-4">
                  <div className="flex gap-15 justify-center items-center">
                    <h3 className="text-xl font-bold mb-2 text-white">Buguati Chiron</h3>
                    <Image
                      src="https://bugatti-newsroom.imgix.net/a32c5a46-eb09-4a6f-ac28-35622dde9d4d/12%20BUGATTI_Roadster_launch-set"
                      alt="Buguati Chiron"
                      width={200}
                      height={120}
                      className="rounded-lg border border-[#1985df]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#1985df] uppercase tracking-wide">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#232834] border-[#1985df]/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1985df] rounded-full p-2">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-white">Disneyland Park</h3>
                    <p className="text-gray-400">3 hours • April 15, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#232834] border-[#1985df]/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1985df] rounded-full p-2">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-white">21 Iacoli Parking</h3>
                    <p className="text-gray-400">2 hours • April 2, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#232834] border-[#1985df]/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1985df] rounded-full p-2">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-white">Patil Mall Parking</h3>
                    <p className="text-gray-400">2 hours • April 2, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#232834] border-[#1985df]/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1985df] rounded-full p-2">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-white">Parking Lot C</h3>
                    <p className="text-gray-400">5 hours • March 20, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}