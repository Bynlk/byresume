"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyTrend {
  date: string;
  pdfExports: number;
  aiUsage: number;
}

interface TrendChartProps {
  data: DailyTrend[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // 格式化日期显示
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  // 如果没有数据，显示空状态
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border rounded-lg bg-muted/20">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">暂无数据</div>
          <p className="text-sm text-muted-foreground">开始使用产品后，这里将显示使用趋势</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="pdfExports"
            name="PDF导出"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="aiUsage"
            name="AI使用"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 格式化日期：将 YYYY-MM-DD 转换为 MM/DD
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}