import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

const LineChartComponent = ({ data = [], loading = false, error = null, title = 'Line Chart', height = 300, dataKeys = ['value'], xKey = 'name' }) => {
  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-[#1A1D26] rounded-lg border border-gray-700">
        <BiLoaderAlt className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center bg-[#1A1D26] rounded-lg border border-gray-700 text-gray-400">
        <FiAlertCircle className="w-12 h-12 mb-2 text-red-400" />
        <p className="text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-[#1A1D26] rounded-lg border border-gray-700">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1D26] rounded-lg border border-gray-700 p-6">
      <h3 className="text-white font-semibold mb-4 text-lg">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F3F4F6' }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={['#8B5CF6', '#10B981', '#EC4899'][index % 3]} strokeWidth={3} dot={{ fill: ['#8B5CF6', '#10B981', '#EC4899'][index % 3], strokeWidth: 2 }} activeDot={{ r: 6 }} />
            ))}
            {dataKeys.map((key, index) => (
              <Area key={`area-${key}`} type="monotone" dataKey={key} fill={['#8B5CF6', '#10B981', '#EC4899'][index % 3]} fillOpacity={0.1} stroke="none" />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;

