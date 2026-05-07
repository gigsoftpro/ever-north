import React from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Activity,
  ArrowUpRight,
} from "lucide-react"; // Optional: For icons

const AdminHome = () => {
  // Static data for display
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,285",
      change: "+12.5%",
      icon: <ShoppingCart size={20} />,
    },
    {
      label: "Active Users",
      value: "2,405",
      change: "+3.2%",
      icon: <Users size={20} />,
    },
    {
      label: "Conversion Rate",
      value: "4.8%",
      change: "+1.2%",
      icon: <Activity size={20} />,
    },
  ];

  return (
    <div className="bg-[#f8fafc] p-8 font-sans text-slate-800 rounded-2xl">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-2">
          Welcome back. Here is what's happening today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                {stat.icon}
              </div>
              <span className="text-emerald-500 text-sm font-medium flex items-center">
                {stat.change} <ArrowUpRight size={14} className="ml-1" />
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">System Notifications</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center pb-4 border-b border-slate-50 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                <div>
                  <p className="text-sm font-medium">
                    New server update available
                  </p>
                  <p className="text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Platform Status</h2>
            <p className="text-slate-400 text-sm">
              All systems are operational. No issues reported in the last 24
              hours.
            </p>
          </div>
          <button className="mt-6 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium w-fit hover:bg-slate-200 transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
