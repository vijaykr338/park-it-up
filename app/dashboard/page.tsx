"use client"
import { useState } from "react"
import { TabBar } from "../../components/tab-bar"
import { DashboardTab } from "../../components/dashboard-tab"
import { StaffManagementTab } from "../../components/staff-management-tab"

export default function ParkingDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
      case "staff":
        return <StaffManagementTab />
      default:
        return <DashboardTab timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveTab()}
      </div>
    </div>
  )
}
