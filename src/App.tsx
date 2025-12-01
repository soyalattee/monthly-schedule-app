"use client"

import { useState, useEffect } from "react"
import ScheduleInput from "@/components/schedule-input"
import ScheduleCalendar from "@/components/schedule-calendar"
import DailyColleagueManager from "@/components/daily-colleague-manager"
import "./App.css"

export default function App() {
  const [scheduleData, setScheduleData] = useState<Record<string, Record<number, string>>>({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dailyColleagues, setDailyColleagues] = useState<Record<string, Record<number, string[]>>>({})
  const [wakeUpTimes, setWakeUpTimes] = useState<Record<string, Record<number, string>>>({})
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedSchedule = localStorage.getItem("scheduleData")
    const savedColleagues = localStorage.getItem("dailyColleagues")
    const savedWakeUpTimes = localStorage.getItem("wakeUpTimes")

    if (savedSchedule) {
      setScheduleData(JSON.parse(savedSchedule))
    }
    if (savedColleagues) {
      setDailyColleagues(JSON.parse(savedColleagues))
    }
    if (savedWakeUpTimes) {
      setWakeUpTimes(JSON.parse(savedWakeUpTimes))
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("scheduleData", JSON.stringify(scheduleData))
    }
  }, [scheduleData, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dailyColleagues", JSON.stringify(dailyColleagues))
    }
  }, [dailyColleagues, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wakeUpTimes", JSON.stringify(wakeUpTimes))
    }
  }, [wakeUpTimes, isLoaded])

  const getMonthKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
  }

  const handleScheduleSubmit = (schedule: string, month: Date) => {
    const monthKey = getMonthKey(month)
    const data: Record<number, string> = {}
    for (let i = 0; i < schedule.length; i++) {
      data[i + 1] = schedule[i]
    }
    setScheduleData({
      ...scheduleData,
      [monthKey]: data,
    })
    setCurrentMonth(month)
    setSelectedDay(null)
  }

  const getScheduleType = (code: string) => {
    const scheduleMap: Record<string, string> = {
      주: "주간",
      야: "야간",
      비: "비번",
      휴: "휴무",
    }
    return scheduleMap[code] || ""
  }

  const monthKey = getMonthKey(currentMonth)
  const currentMonthSchedule = scheduleData[monthKey] || {}
  const currentMonthColleagues = dailyColleagues[monthKey] || {}
  const currentMonthWakeUpTimes = wakeUpTimes[monthKey] || {}

  const updateDayColleagues = (day: number, colleagues: string[]) => {
    setDailyColleagues({
      ...dailyColleagues,
      [monthKey]: {
        ...currentMonthColleagues,
        [day]: colleagues,
      },
    })
  }

  const updateDayWakeUpTime = (day: number, time: string) => {
    setWakeUpTimes({
      ...wakeUpTimes,
      [monthKey]: {
        ...currentMonthWakeUpTimes,
        [day]: time,
      },
    })
  }

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    setCurrentMonth(prev)
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    setCurrentMonth(next)
    setSelectedDay(null)
  }

  if (!isLoaded) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">월간 스케줄</h1>
          <p className="text-slate-600">월간 근무 스케줄을 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <ScheduleInput onSubmit={handleScheduleSubmit} />
              <DailyColleagueManager
                selectedDay={selectedDay}
                dailyColleagues={currentMonthColleagues}
                onUpdateColleagues={updateDayColleagues}
                wakeUpTime={selectedDay ? currentMonthWakeUpTimes[selectedDay] || "" : ""}
                onUpdateWakeUpTime={updateDayWakeUpTime}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <ScheduleCalendar
              month={currentMonth}
              scheduleData={currentMonthSchedule}
              dailyColleagues={currentMonthColleagues}
              wakeUpTimes={currentMonthWakeUpTimes}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              getScheduleType={getScheduleType}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
