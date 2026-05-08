"use client";

import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TimeFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export default function TimeFilter({ selectedRange, onRangeChange }: TimeFilterProps) {
  const timeRanges = [
    { id: "7days", label: "最近7天" },
    { id: "30days", label: "最近30天" },
    { id: "90days", label: "最近90天" },
    { id: "all", label: "全部时间" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">时间筛选</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.id}
            variant={selectedRange === range.id ? "default" : "outline"}
            size="sm"
            onClick={() => onRangeChange(range.id)}
            className="text-xs"
          >
            {range.label}
          </Button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-1 sm:mt-0 sm:ml-auto">
        <Calendar className="inline h-3 w-3 mr-1" />
        当前显示: {timeRanges.find(r => r.id === selectedRange)?.label}
      </div>
    </div>
  );
}