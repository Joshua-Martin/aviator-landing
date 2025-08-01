import React from 'react';
import {
  BarChart3,
  Users,
  FileText,
  Plus,
  Hash,
  User,
  Mail,
  Home,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

/**
 * Mock data for the pie chart showing user distribution
 */
const pieChartData = [
  { name: 'Active', value: 65, color: '#3B82F6' },
  { name: 'Inactive', value: 25, color: '#93C5FD' },
  { name: 'Pending', value: 10, color: '#DBEAFE' },
];

// Mock data for the stat card area charts
const statAreaData1 = [
  { value: 200 },
  { value: 400 },
  { value: 300 },
  { value: 500 },
  { value: 450 },
  { value: 600 },
  { value: 550 },
];
const statAreaData2 = [
  { value: 20 },
  { value: 40 },
  { value: 60 },
  { value: 30 },
  { value: 50 },
  { value: 70 },
  { value: 90 },
];
const statAreaData3 = [
  { value: 1000 },
  { value: 1200 },
  { value: 1100 },
  { value: 1300 },
  { value: 1250 },
  { value: 1400 },
  { value: 1500 },
];

/**
 * Mock data for the area chart showing monthly active users and churn
 */
const areaChartData = [
  { name: 'Jan', users: 400, churn: 80 },
  { name: 'Feb', users: 600, churn: 120 },
  { name: 'Mar', users: 800, churn: 60 },
  { name: 'Apr', users: 1200, churn: 200 },
  { name: 'May', users: 1600, churn: 90 },
  { name: 'Jun', users: 2000, churn: 250 },
  { name: 'Jul', users: 2400, churn: 380 },
  { name: 'Aug', users: 2200, churn: 520 },
  { name: 'Sep', users: 2600, churn: 180 },
  { name: 'Oct', users: 3000, churn: 350 },
  { name: 'Nov', users: 3400, churn: 170 },
  { name: 'Dec', users: 3800, churn: 400 },
];

/**
 * Renders a small notification bell icon with a red indicator dot.
 */
const NotificationBell: React.FC = () => (
  <div className="relative">
    <Bell className="w-4 h-4 text-gray-500" />
    <span className="absolute -top-[0.1rem] -right-[0.1rem] w-2 h-2 bg-red-500 rounded-full" />
  </div>
);

/**
 * Renders a stat card with a value, label, delta, and a horizontally-stretching area chart centered above the value.
 * @param value - The main stat value
 * @param label - The label for the stat
 * @param delta - The change indicator (string, e.g. '+12%')
 * @param deltaColor - Tailwind color class for the delta
 * @param areaData - Data for the area chart
 * @param gradientId - Unique gradient id for the chart
 * @param gradientFrom - Gradient start color
 * @param gradientTo - Gradient end color
 */
const StatCard: React.FC<{
  value: string;
  label: string;
  delta: string;
  deltaColor: string;
  areaData: { value: number }[];
  gradientId: string;
  gradientFrom: string;
  gradientTo: string;
}> = ({ value, label, delta, deltaColor, areaData, gradientId, gradientFrom, gradientTo }) => (
  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
    <div className="w-full flex justify-center mb-1">
      <div className="w-full h-20 flex items-center justify-center p-2">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="focus:outline-none focus:ring-0 pointer-events-none"
        >
          <AreaChart data={areaData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientTo} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={gradientFrom}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="text-lg font-bold text-gray-900 text-center">{value}</div>
    <div className="text-[0.5rem] text-gray-600 text-center">{label}</div>
    <div className={`text-[0.5rem] mt-1 text-center ${deltaColor}`}>{delta}</div>
  </div>
);

/**
 * Dashboard content for Step Three, used in the browser mockup.
 */
export const StepOneContent: React.FC = () => {
  return (
    <div className="w-full bg-gray-50 min-h-[50vh] max-h-[40rem] flex flex-col rounded-xl overflow-hidden">
      {/* Logo/Header */}
      <div className="p-2 px-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">App Dashboard</span>
        </div>
        {/* Notification Bell in top right */}
        <NotificationBell />
      </div>
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <div className="w-[3rem] bg-white shadow-sm border-r border-gray-200 flex flex-col">
          {/* Navigation Menu */}
          <nav className="flex-1 p-2">
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Home className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Plus className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Hash className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-2">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-lg font-bold text-gray-900 mb-2">Welcome, John</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <StatCard
              value="8,147"
              label="Total Views"
              delta="-2.1%"
              deltaColor="text-red-500"
              areaData={statAreaData1}
              gradientId="stat1"
              gradientFrom="#3B82F6"
              gradientTo="#93C5FD"
            />
            <StatCard
              value="29"
              label="New Users"
              delta="+12%"
              deltaColor="text-green-500"
              areaData={statAreaData2}
              gradientId="stat2"
              gradientFrom="#10B981"
              gradientTo="#6EE7B7"
            />
            <StatCard
              value="17,281"
              label="Total Engagements"
              delta="+8.2%"
              deltaColor="text-green-500"
              areaData={statAreaData3}
              gradientId="stat3"
              gradientFrom="#F59E42"
              gradientTo="#FDE68A"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-2">
            {/* Area Chart for Monthly Active Users */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Users Overview</h3>
                  <p className="text-[0.5rem] text-gray-600">Monthly active users</p>
                </div>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
              <div className="h-[8rem]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  className="focus:outline-none focus:ring-0 pointer-events-none"
                >
                  <AreaChart
                    data={areaChartData}
                    margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FECACA" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3B82F6"
                      fill="url(#usersGradient)"
                      strokeWidth={3}
                      dot={false}
                      activeDot={false}
                      name="Total Users"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="churn"
                      stroke="#F87171"
                      fill="url(#churnGradient)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                      name="Churn"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">User Status</h3>
                  <p className="text-[0.5rem] text-gray-600">User distribution</p>
                </div>
                <Users className="w-3 h-3 text-blue-500" />
              </div>
              <div className="h-[8rem] flex items-center justify-center">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  className="focus:outline-none focus:ring-0 pointer-events-none"
                >
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {pieChartData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[0.5rem] text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOneContent;
