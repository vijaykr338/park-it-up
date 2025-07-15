"use client"

import { cn } from "@/lib/utils"

interface TabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "staff", label: "Staff Management" },
  ]

  return (
    <div className="flex gap-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-colors",
            activeTab === tab.id ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
