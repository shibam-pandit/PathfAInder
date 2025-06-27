'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { format, isValid, isDate } from 'date-fns';

// Enhanced date formatting to handle Date objects or strings
const formatDate = (dateInput) => {
  if (!dateInput) {
    return 'Invalid Date';
  }
  try {
    let date;
    if (isDate(dateInput) && isValid(dateInput)) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'object' && dateInput.seconds) {
      date = new Date(dateInput.seconds * 1000);
    } else {
      return 'Invalid Date';
    }

    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, 'MMM d');
  } catch (error) {
    console.error('Date parsing error:', error, 'Date input:', dateInput);
    return 'Invalid Date';
  }
};

// Premium CustomTooltip with enhanced styling
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const { score, originalDate } = payload[0].payload;
  
  return (
    <div className="bg-white/95 backdrop-blur-sm border-0 p-4 rounded-xl shadow-2xl ring-1 ring-purple-100">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
        <p className="text-gray-900 font-semibold text-sm">
          Score: {score?.toFixed(0) || 'N/A'}/10
        </p>
      </div>
      <p className="text-gray-600 text-xs">
        {format(new Date(originalDate), 'MMM d, yyyy')}
      </p>
    </div>
  );
};

const PastScoreCard = ({ quizData = [] }) => {
  // Robust data transformation with handling for Date objects
  const data = quizData
    .filter(quiz => 
      quiz?.quizscore != null && 
      quiz?.createdat != null
    )
    .map((quiz, index) => ({
      score: Number(quiz.quizscore),
      date: formatDate(quiz.createdat),
      originalDate: quiz.createdat,
      name: `Quiz ${index + 1}`
    }))
    .sort((a, b) => {
      try {
        const dateA = isDate(a.originalDate) ? a.originalDate : 
                     typeof a.originalDate === 'object' && a.originalDate.seconds ? 
                     new Date(a.originalDate.seconds * 1000) : new Date(a.originalDate);
        const dateB = isDate(b.originalDate) ? b.originalDate : 
                     typeof b.originalDate === 'object' && b.originalDate.seconds ? 
                     new Date(b.originalDate.seconds * 1000) : new Date(b.originalDate);
        return dateA - dateB;
      } catch {
        return 0;
      }
    });

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Performance Data</h3>
        <p className="text-gray-500 text-sm">Complete more quizzes to see your progress chart</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600 font-medium">Performance Trend</p>
          <p className="text-2xl font-bold text-gray-900">{data.length} Quiz{data.length !== 1 ? 'es' : ''}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Latest Score</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {data[data.length - 1]?.score || 0}/10
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            stroke="#f1f5f9" 
            strokeDasharray="3 3" 
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickMargin={15}
          />
          <YAxis 
            domain={[0, 10]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickMargin={10}
            tickCount={6}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          />
          <Line type={"monotone"} dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="url(#colorScore)"
            dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#fff' }}
            activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PastScoreCard;