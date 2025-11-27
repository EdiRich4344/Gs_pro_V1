import React from 'react';

interface ChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    data: ChartData[];
    title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
                <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No data to display.
                </div>
            </div>
        );
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
            <div className="flex-grow flex mt-4 space-x-2 items-end relative h-full">
                {data.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                            <div className="absolute top-0 text-center w-full">
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                    ₹{item.value.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div 
                                className="w-full bg-violet-300 dark:bg-violet-700 hover:bg-violet-500 dark:hover:bg-violet-600 rounded-t-md transition-all duration-300" 
                                style={{ height: `${barHeight}%` }}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BarChart;