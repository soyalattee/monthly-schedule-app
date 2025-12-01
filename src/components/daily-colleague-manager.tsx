"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { X } from "lucide-react"

interface DailyColleagueManagerProps {
  selectedDay: number | null
  dailyColleagues: Record<number, string[]>
  onUpdateColleagues: (day: number, colleagues: string[]) => void
  wakeUpTime: string
  onUpdateWakeUpTime: (day: number, time: string) => void
}

export default function DailyColleagueManager({
  selectedDay,
  dailyColleagues,
  onUpdateColleagues,
  wakeUpTime,
  onUpdateWakeUpTime,
}: DailyColleagueManagerProps) {
  const [input, setInput] = useState("")
  const currentColleagues = selectedDay ? dailyColleagues[selectedDay] || [] : []

  useEffect(() => {
    setInput("")
  }, [selectedDay])

  const handleAdd = () => {
    if (input.trim() && selectedDay) {
      const newColleagues = [...currentColleagues, input.trim()]
      onUpdateColleagues(selectedDay, newColleagues)
      setInput("")
    }
  }

  const handleRemove = (index: number) => {
    if (selectedDay) {
      const newColleagues = currentColleagues.filter((_, i) => i !== index)
      onUpdateColleagues(selectedDay, newColleagues)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  const handleWakeUpTimeChange = (time: string) => {
    if (selectedDay) {
      onUpdateWakeUpTime(selectedDay, time)
    }
  }

  if (!selectedDay) {
    return (
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="font-semibold text-slate-900">일정 정보</h3>
        <p className="text-sm text-slate-500">캘린더에서 날짜를 선택하세요</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">{selectedDay}일 기상 시간</h3>
        <div className="flex gap-2">
          <select
            value={wakeUpTime}
            onChange={(e) => handleWakeUpTimeChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">기상 시간 선택</option>
            <option value="4:30">4:30</option>
            <option value="6:00">6:00</option>
            <option value="기타">기타 시간</option>
          </select>
        </div>
        {wakeUpTime && wakeUpTime !== "기타" && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700 font-medium">기상 시간: {wakeUpTime}</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">{selectedDay}일 함께 일하는 사람</h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="이름 입력"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Button onClick={handleAdd} size="sm" className="bg-green-600 hover:bg-green-700">
            추가
          </Button>
        </div>

        {currentColleagues.length > 0 && (
          <div className="space-y-2 mt-3">
            {currentColleagues.map((colleague, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200"
              >
                <span className="text-sm text-slate-700">{colleague}</span>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
