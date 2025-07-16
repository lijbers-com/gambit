"use client"

import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

export default function TestDatePickerPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">DatePicker Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Default DatePicker</h2>
          <DatePicker
            date={date}
            onDateChange={setDate}
            placeholder="Pick a date"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Selected Date</h2>
          <p className="text-sm text-muted-foreground">
            {date ? `Selected: ${date.toLocaleDateString()}` : "No date selected"}
          </p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Disabled DatePicker</h2>
          <DatePicker
            date={date}
            onDateChange={setDate}
            placeholder="Disabled picker"
            disabled={true}
          />
        </div>
      </div>
    </div>
  )
} 