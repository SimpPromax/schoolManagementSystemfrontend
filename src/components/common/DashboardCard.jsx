// components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, color = 'blue', description, trend, children }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColors[trend.type]}`}>
              <span>{trend.value}</span>
              <span>{trend.label}</span>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;