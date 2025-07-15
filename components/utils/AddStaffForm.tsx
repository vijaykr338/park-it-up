import React, { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import gsap from "gsap"

interface AddStaffFormProps {
  onClose: () => void
}

const AddStaffForm = forwardRef<HTMLDivElement, AddStaffFormProps>(({ onClose }, ref) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ref && typeof ref !== "function" && ref.current) {
      gsap.to(ref.current, {
        y: 100,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: onClose,
      })
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Add Staff Member</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">✕</button>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium mb-2">Employee ID</label>
            <input type="text" className="w-full border rounded px-4 py-3 text-lg" placeholder="Enter Employee ID" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Name</label>
            <input type="text" className="w-full border rounded px-4 py-3 text-lg" placeholder="Enter Name" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Phone Number</label>
            <input type="text" className="w-full border rounded px-4 py-3 text-lg" placeholder="Enter Phone Number" />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="px-6 py-2 text-lg">Cancel</Button>
            <Button type="submit" className="px-6 py-2 text-lg">Add</Button>
          </div>
        </form>
      </div>
    </div>
  )
})

AddStaffForm.displayName = "AddStaffForm"

export default AddStaffForm
