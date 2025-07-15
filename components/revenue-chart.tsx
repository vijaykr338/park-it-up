"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RevenueChartProps {
  timePeriod: "daily" | "weekly" | "monthly"
  onTimePeriodChange: (period: "daily" | "weekly" | "monthly") => void
}

export function RevenueChart({ timePeriod, onTimePeriodChange }: RevenueChartProps) {
  const dailyData = [
    { label: 18, value: 8000 },
    { label: 19, value: 17000 },
    { label: 20, value: 15000 },
    { label: 21, value: 32000 },
    { label: 22, value: 21000 },
    { label: 24, value: 25000 },
  ]

  const weeklyData = [
    { label: "W1", value: 45000 },
    { label: "W2", value: 52000 },
    { label: "W3", value: 38000 },
    { label: "W4", value: 61000 },
  ]

  const monthlyData = [
    { label: "Jan", value: 180000 },
    { label: "Feb", value: 220000 },
    { label: "Mar", value: 195000 },
    { label: "Apr", value: 240000 },
    { label: "May", value: 210000 },
    { label: "Jun", value: 185000 },
  ]

  const getData = () => {
    switch (timePeriod) {
      case "daily":
        return dailyData
      case "weekly":
        return weeklyData
      case "monthly":
        return monthlyData
      default:
        return dailyData
    }
  }

  const data = getData()
  const maxRevenue = Math.max(...data.map((d) => d.value))

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold">Revenue</CardTitle>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => onTimePeriodChange(period)}
              className={cn(
                "px-3 py-1 text-sm rounded capitalize",
                timePeriod === period ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200",
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <CardContent>
        <div className="h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>₹{Math.round(maxRevenue / 1000)}k</span>
            <span>₹{Math.round((maxRevenue * 0.75) / 1000)}k</span>
            <span>₹{Math.round((maxRevenue * 0.5) / 1000)}k</span>
            <span>₹{Math.round((maxRevenue * 0.25) / 1000)}k</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f3f4f6" strokeWidth="1" />
              ))}

              {/* Revenue line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points={data
                  .map((d, i) => `${i * (400 / (data.length - 1))},${200 - (d.value / maxRevenue) * 180}`)
                  .join(" ")}
              />

              {/* Data points */}
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={i * (400 / (data.length - 1))}
                  cy={200 - (d.value / maxRevenue) * 180}
                  r="4"
                  fill="#3b82f6"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {data.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </CardHeader>
  )
}
