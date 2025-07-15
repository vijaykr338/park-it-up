"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, DollarSign, Calendar } from "lucide-react"
import { RevenueChart } from "./revenue-chart"
import { Badge } from "@/components/ui/badge"

interface DashboardTabProps {
  timePeriod: "daily" | "weekly" | "monthly"
  onTimePeriodChange: (period: "daily" | "weekly" | "monthly") => void
}

export function DashboardTab({ timePeriod, onTimePeriodChange }: DashboardTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Live Parking Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Live Parking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-green-500 rounded-lg p-2">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-red-500 rounded-lg p-2">
                <X className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">76</div>
                <div className="text-sm text-gray-600">Occupied</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Revenue Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">{"Today's Revenue"}</div>
                <div className="text-xl font-bold">₹ 2,500</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">This Week</div>
                <div className="text-xl font-bold">₹ 12,400</div>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <div className="bg-blue-100 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">This Month</div>
                <div className="text-xl font-bold">₹ 42,100</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="lg:col-span-2">
        <RevenueChart timePeriod={timePeriod} onTimePeriodChange={onTimePeriodChange} />
      </Card>

      {/* Staff On Duty */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Staff On Duty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <span>Staff On Duty</span>
              <span>Shift Time</span>
              <span>Status</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="font-medium">John Doe</span>
              <span className="text-sm text-gray-600">9:00 AM-5 PM</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">On Duty</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="font-medium">Jane Smith</span>
              <span className="text-sm text-gray-600">1:00 PM-9 PM</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">On Duty</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="font-medium">Mike Johnson</span>
              <span className="text-sm text-gray-600">12:00 PM-8 PM</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">On Duty</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="font-medium">Sarah Williams</span>
              <span className="text-sm text-gray-600">10:00 AM-6 PM</span>
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 w-fit">Off Duty</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
