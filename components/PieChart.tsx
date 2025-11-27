import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
        <div className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
            <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data available.
            </div>
        </div>
    );
  }

  let cumulativePercentage = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90">
                    {data.map((item, index) => {
                        const percent = item.value / total;
                        const [startX, startY] = getCoordinatesForPercent(cumulativePercentage);
                        cumulativePercentage += percent;
                        const [endX, endY] = getCoordinatesForPercent(cumulativePercentage);
                        const largeArcFlag = percent > 0.5 ? 1 : 0;
                        const pathData = [
                            `M ${startX} ${startY}`, // Move
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                            `L 0 0`, // Line to center
                        ].join(' ');

                        return <path key={index} d={pathData} fill={item.color} />;
                    })}
                </svg>
            </div>
            <div className="flex-1 space-y-2 w-full">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {((item.value / total) * 100).toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PieChart;
