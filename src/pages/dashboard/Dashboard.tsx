import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const stats = {
    totalApplications: 120,
    pending: 45,
    approved: 60,
    rejected: 15,
  };
  
  const activityLogs = [
    { id: 1, action: "Approved application #123", user: "Reviewer A", time: "2 hrs ago" },
    { id: 2, action: "Rejected application #124", user: "Reviewer B", time: "4 hrs ago" },
    { id: 3, action: "Final approval for #125", user: "Governor X", time: "1 day ago" },
  ];
  
  const chartData = [
    { name: "Jan", approved: 30, rejected: 5 },
    { name: "Feb", approved: 40, rejected: 10 },
    { name: "Mar", approved: 50, rejected: 7 },
  ];
  return (
    <div>
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="bg-white p-4 rounded shadow-md">Total Applications: {stats.totalApplications}</div>
      <div className="bg-yellow-400 p-4 rounded shadow-md">Pending: {stats.pending}</div>
      <div className="bg-green-400 p-4 rounded shadow-md">Approved: {stats.approved}</div>
      <div className="bg-red-400 p-4 rounded shadow-md">Rejected: {stats.rejected}</div>
    </div>
    
    {/* Chart Section */}
    <div className="bg-white p-6 mt-6 shadow-md rounded">
      <h2 className="text-lg font-bold">Approval Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="approved" fill="#4CAF50" />
          <Bar dataKey="rejected" fill="#F44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    {/* Activity Log */}
    <div className="bg-white p-6 mt-6 shadow-md rounded">
      <h2 className="text-lg font-bold">Recent Activities</h2>
      <ul className="mt-2">
        {activityLogs.map((log) => (
          <li key={log.id} className="border-b py-2">{log.user} - {log.action} ({log.time})</li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default Dashboard