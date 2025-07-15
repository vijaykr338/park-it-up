"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import gsap from "gsap"
import AddStaffForm from "./utils/AddStaffForm"

export function StaffManagementTab() {
  const staffMembers = [
    { id: 1, name: "Eren Yeagar", shift: "9:00 AM-5 PM", status: "On Duty", phone: "+91 1234567890" },
    { id: 2, name: "Shu Kurenai", shift: "1:00 PM-9 PM", status: "On Duty", phone: "+91 1234567890" },
    { id: 3, name: "Valt Aoi", shift: "12:00 PM-8 PM", status: "On Duty", phone: "+91 1234567890" },
    { id: 4, name: "Ben Stokes", shift: "10:00 AM-6 PM", status: "Off Duty", phone: "+91 1234567890" },
    { id: 5, name: "Jude Rice", shift: "2:00 PM-10 PM", status: "On Duty", phone: "+91 1234567890" },
  ]

  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const handleAddStaffClick = () => {
    setShowForm(true)
    setTimeout(() => {
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        )
      }
    }, 10)
  }

  const handleCloseForm = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => setShowForm(false),
      })
    } else {
      setShowForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-gray-600">Manage your parking staff and their schedules</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddStaffClick}>
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      {showForm && (
        <AddStaffForm ref={formRef} onClose={handleCloseForm} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">Staff On Duty</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Staff Off Duty</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Total Staff</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <span>Name</span>
              <span>Shift Time</span>
              <span>Status</span>
              <span>Phone</span>
              <span>Actions</span>
            </div>
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="grid grid-cols-5 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium">{staff.name}</span>
                <span className="text-sm text-gray-600">{staff.shift}</span>
                <Badge
                  className={
                    staff.status === "On Duty"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 w-fit"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100 w-fit"
                  }
                >
                  {staff.status}
                </Badge>
                <span className="text-sm text-gray-600">{staff.phone}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
