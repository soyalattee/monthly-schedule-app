import type React from "react";
import { useState } from "react";
import { Button } from "@/components/button";

interface ScheduleInputProps {
  onSubmit: (schedule: string, month: Date) => void;
}

export default function ScheduleInput({ onSubmit }: ScheduleInputProps) {
  const [input, setInput] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) {
      setError("스케줄을 입력해주세요");
      return;
    }

    const validChars = /^[주야비휴]+$/;
    if (!validChars.test(input)) {
      setError("주, 야, 비, 휴만 입력 가능합니다");
      return;
    }

    const [year, monthStr] = month.split("-");
    const monthDate = new Date(
      Number.parseInt(year),
      Number.parseInt(monthStr) - 1
    );
    const daysInMonth = new Date(
      Number.parseInt(year),
      Number.parseInt(monthStr),
      0
    ).getDate();

    if (input.length !== daysInMonth) {
      setError(`${daysInMonth}일까지 입력해주세요 (현재: ${input.length}자)`);
      return;
    }

    setError("");
    onSubmit(input, monthDate);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          월 선택
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          스케줄 입력
        </label>
        <div className="space-y-2">
          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
            <p className="font-semibold mb-1">입력 규칙:</p>
            <p>주: 주간근무 | 야: 야간근무</p>
            <p>비: 비번 | 휴: 휴무</p>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\s/g, ""))}
            onKeyPress={handleKeyPress}
            placeholder="예: 주주야비주주야비휴휴"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            rows={3}
          />
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <span className="text-white">스케줄 등록</span>
      </Button>
    </div>
  );
}
