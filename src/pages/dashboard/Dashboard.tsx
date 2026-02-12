import { useSelector } from 'react-redux';
import { XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { RootState } from '../../store/store';
import { FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaRedo, FaExclamationTriangle } from 'react-icons/fa';
import { useDashboardStats, useCofOActivityLogs, useCofOMonthlyTrends, useMyInboxTasks } from '../../hooks/useDashboard';
import { FaBell } from 'react-icons/fa';

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const Dashboard = () => {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const { stats: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats(user?.role);
  const { logs, isLoading: logsLoading, error: logsError } = useCofOActivityLogs();
  console.log(logs)
  const { trends, error: trendsError } = useCofOMonthlyTrends();
  const { tasks, isLoading: tasksLoading, error: tasksError } = useMyInboxTasks();

  // Determine role-based view
  const role = (user?.role || "").toString().toLowerCase();
  // const isGovernor = role.includes("governor");
  // Treat 'approver' as reviewer-equivalent in our UI
  const isReviewer =  role.includes("approver");


  // Build stats cards depending on role (reviewer vs governor/default)
  const stats = isReviewer ? [
    {
      title: "Total Applications",
      value: dashboardStats?.total || 0,
      icon: <FaFileAlt />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Review",
      value: dashboardStats?.pending || 0,
      icon: <FaClock />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Completed",
      value: dashboardStats?.completed || 0,
      icon: <FaCheckCircle />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Needs Correction",
      value: dashboardStats?.needsCorrection ?? 0,
      icon: <FaExclamationTriangle />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Resubmitted",
      value: dashboardStats?.resubmitted ?? 0,
      icon: <FaRedo />,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Rejected",
      value: dashboardStats?.rejected ?? 0,
      icon: <FaTimesCircle />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
  ] : [
    {
      title: "Total Applications",
      value: dashboardStats?.total || 0,
      icon: <FaFileAlt />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Review",
      value: dashboardStats?.pending || 0,
      icon: <FaClock />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Approved",
      value: dashboardStats?.approved || 0,
      icon: <FaCheckCircle />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Rejected",
      value: dashboardStats?.rejected || 0,
      icon: <FaTimesCircle />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
  ];

  const activityLogs = (logs || []).map((log) => ({
    id: log.id,
    action: `Application #${log.cofOId.slice(0, 8)}`,
    user: "System",
    time: formatTimeAgo(log.createdAt),
    status: log.cofO?.status?.toLowerCase().replace('_', ' ') || 'pending',
  }));

  const chartData = trends && trends.length > 0 ? trends : [
    { month: "January", approved: 30, rejected: 5, pending: 15 },
    { month: "February", approved: 40, rejected: 10, pending: 12 },
    { month: "March", approved: 50, rejected: 7, pending: 18 },
    { month: "April", approved: 35, rejected: 8, pending: 20 },
    { month: "May", approved: 60, rejected: 5, pending: 10 },
  ];

  const statusData = isReviewer ? [
    { name: "Completed", value: dashboardStats?.completed || 0, color: "#10B981" },
    { name: "Pending", value: dashboardStats?.pending || 0, color: "#F59E0B" },
    { name: "Needs Correction", value: dashboardStats?.needsCorrection || 0, color: "#F97316" },
    { name: "Resubmitted", value: dashboardStats?.resubmitted ?? 0, color: "#6366F1" },
    { name: "Rejected", value: dashboardStats?.rejected || 0, color: "#EF4444" },
  ] : [
    { name: "Approved", value: dashboardStats?.approved || 0, color: "#10B981" },
    { name: "Pending", value: dashboardStats?.pending || 0, color: "#F59E0B" },
    { name: "Rejected", value: dashboardStats?.rejected || 0, color: "#EF4444" },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Dashboard Overview</h1>
        <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">Monitor and manage applications</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="gov-card overflow-hidden hover:shadow-gov-lg transition-shadow">
            <div className={`bg-gradient-to-br ${stat.color} p-4 sm:p-6 flex justify-between items-start`}>
              <div className="min-w-0">
                <p className="text-white/80 text-xs sm:text-sm font-medium truncate">{stat.title}</p>
                <p className="text-white text-2xl sm:text-3xl font-bold mt-2">{statsLoading ? '...' : stat.value}</p>
              </div>
              <div className="text-white/60 text-lg sm:text-2xl flex-shrink-0">{stat.icon}</div>
            </div>
            <div className={`${stat.bgColor} px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-700`}>
              {statsError ? 'Error loading' : 'Updated: Today'}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 gov-card p-4 sm:p-6 overflow-x-auto">
          <h2 className="text-base sm:text-lg font-bold text-gov-text mb-4">Approval Trends</h2>
          {trendsError && <p className="text-red-500 text-xs mb-2">Error loading trends</p>}
          <div className="w-full min-h-[250px] sm:min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#f5f7fa", border: "1px solid #d3d8de" }}
                  labelStyle={{ color: "#1a1a1a" }}
                />
                <Legend />
                <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="gov-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gov-text mb-4">Status Distribution</h2>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gov-text-light truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-gov-text flex-shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="gov-card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-gov-text mb-4">Recent Activities</h2>
        {logsError && <p className="text-red-500 text-sm mb-4">Error loading activities</p>}
        {logsLoading && <p className="text-gray-500 text-sm mb-4">Loading activities...</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-gov-border">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gov-text">Action</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gov-text hidden sm:table-cell">User</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gov-text">Status</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gov-text hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gov-border hover:bg-gov-light transition-colors">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gov-text truncate">{log.action}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gov-text-light hidden sm:table-cell text-xs">{log.user}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`gov-badge text-xs ${
                        log.status === 'approved' ? 'gov-badge-success' :
                        log.status === 'rejected_final' || log.status.includes('rejected') ? 'gov-badge-danger' :
                        'gov-badge-warning'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gov-text-light text-xs hidden md:table-cell">{log.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gov-text-light">
                    No recent activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inbox Tasks */}
      <div className="gov-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gov-text flex items-center gap-2">
            <FaBell className="text-yellow-500" />
            Inbox Tasks
            {tasks.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold ml-2">
                {tasks.length}
              </span>
            )}
          </h2>
        </div>
        {tasksError && <p className="text-red-500 text-sm mb-4">Error loading inbox tasks</p>}
        {tasksLoading && <p className="text-gray-500 text-sm mb-4">Loading inbox tasks...</p>}
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="border border-gov-border rounded-lg p-3 sm:p-4 hover:bg-gov-light transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gov-text text-sm sm:text-base">
                      Application #{task.cofO?.applicationNumber}
                    </p>
                    <p className="text-xs sm:text-sm text-gov-text-light mt-1">
                      From: {task.cofO?.user?.firstName} {task.cofO?.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {task.cofO?.land?.state?.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`gov-badge text-xs ${
                      task.cofO?.status === 'APPROVED' ? 'gov-badge-success' :
                      task.cofO?.status === 'REJECTED_FINAL' ? 'gov-badge-danger' :
                      task.cofO?.status === 'NEEDS_CORRECTION' ? 'gov-badge-danger' :
                      'gov-badge-warning'
                    }`}>
                      {task.cofO?.status?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(task.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gov-text-light">
              <FaBell className="mx-auto text-2xl mb-2 opacity-50" />
              <p className="text-sm">No pending tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;