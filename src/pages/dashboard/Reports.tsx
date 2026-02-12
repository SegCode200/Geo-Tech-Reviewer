import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaUsers,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { Spin } from "antd";
import {
  useGovernorStatusReport,
  useGovernorProcessingTimeReport,
  useGovernorTrendReport,
  useGovernorReviewerPerformance,
  useGovernorApproverPerformance,
  useGovernorStageDelayReport,
  useGovernorInboxBacklog,
} from "../../hooks/useDashboard";

const Reports = () => {
  const [refreshing, setRefreshing] = useState(false);

  const statusReport = useGovernorStatusReport();
  const processingTimeReport = useGovernorProcessingTimeReport();
  const trendReport = useGovernorTrendReport();
  const reviewerPerformance = useGovernorReviewerPerformance();
  const approverPerformance = useGovernorApproverPerformance();
  const stageDelayReport = useGovernorStageDelayReport();
  const inboxBacklog = useGovernorInboxBacklog();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      statusReport.mutate(),
      processingTimeReport.mutate(),
      trendReport.mutate(),
      reviewerPerformance.mutate(),
      approverPerformance.mutate(),
      stageDelayReport.mutate(),
      inboxBacklog.mutate(),
    ]);
    setRefreshing(false);
  };

  // Prepare chart data from trend report
  const trendData = statusReport.data
    ? Object.entries(trendReport.data || {}).map(([month, count]) => ({
        month: month.replace("-", "/"),
        applications: count,
      }))
    : [];

  // Prepare status distribution data
  const statusData = statusReport.data
    ? [
        { name: "In Review", value: statusReport.data.inReview, color: "#3B82F6" },
        {
          name: "Needs Correction",
          value: statusReport.data.needsCorrection,
          color: "#F59E0B",
        },
        { name: "Resubmitted", value: statusReport.data.resubmitted, color: "#10B981" },
        { name: "Approved", value: statusReport.data.approved, color: "#06B6D4" },
        { name: "Rejected", value: statusReport.data.rejected, color: "#EF4444" },
      ].filter((item) => item.value > 0)
    : [];

  // Prepare reviewer performance data
  const reviewerData = reviewerPerformance.data || [];

  // Prepare approver performance data
  const approverData = approverPerformance.data || [];

  // Prepare stage delay data
  const stageData = stageDelayReport.data || [];

  // Prepare inbox backlog data
  const backlogData = inboxBacklog.data || [];

  const isLoading =
    statusReport.isLoading ||
    processingTimeReport.isLoading ||
    trendReport.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gov-text">Reports & Analytics</h1>
          <p className="text-gov-text-light mt-1">
            Comprehensive overview of applications and performance metrics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spin size="large" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<FaChartBar className="w-5 h-5" />}
              label="Total Applications"
              value={statusReport.data?.total || 0}
              color="bg-blue-500"
            />
            <MetricCard
              icon={<FaExclamationTriangle className="w-5 h-5" />}
              label="In Review"
              value={statusReport.data?.inReview || 0}
              color="bg-yellow-500"
            />
            <MetricCard
              icon={<FaCheckCircle className="w-5 h-5" />}
              label="Approved"
              value={statusReport.data?.approved || 0}
              color="bg-green-500"
            />
            <MetricCard
              icon={<FaClock className="w-5 h-5" />}
              label="Avg Processing Days"
              value={processingTimeReport.data?.averageProcessingDays || 0}
              color="bg-purple-500"
              suffix=" days"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="gov-card p-6">
              <h2 className="text-xl font-semibold text-gov-text mb-4 flex items-center gap-2">
                <FaChartPie className="text-primary" />
                Application Status Distribution
              </h2>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gov-text-light">
                  No data available
                </div>
              )}
            </div>

            {/* Monthly Trend */}
            <div className="gov-card p-6">
              <h2 className="text-xl font-semibold text-gov-text mb-4 flex items-center gap-2">
                <FaChartLine className="text-primary" />
                Monthly Applications Trend
              </h2>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gov-text-light">
                  No trend data available
                </div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reviewer Performance */}
            <div className="gov-card p-6">
              <h2 className="text-xl font-semibold text-gov-text mb-4 flex items-center gap-2">
                <FaUsers className="text-primary" />
                Reviewer Performance
              </h2>
              {reviewerData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reviewerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reviewer" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="handled" fill="#3B82F6" name="Handled" />
                    <Bar dataKey="corrections" fill="#F59E0B" name="Corrections" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gov-text-light">
                  No reviewer data available
                </div>
              )}
            </div>

            {/* Stage Delay Analysis */}
            <div className="gov-card p-6">
              <h2 className="text-xl font-semibold text-gov-text mb-4 flex items-center gap-2">
                <FaClock className="text-primary" />
                Stage Processing Time (Hours)
              </h2>
              {stageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" label={{ value: "Stage", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(2) : value)} />
                    <Bar dataKey="avgHours" fill="#10B981" name="Avg Hours" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gov-text-light">
                  No stage data available
                </div>
              )}
            </div>
          </div>

          {/* Approver Performance Table */}
          <div className="gov-card p-6">
            <h2 className="text-xl font-semibold text-gov-text mb-4 flex items-center gap-2">
              <FaUsers className="text-primary" />
              Approver Performance Summary
            </h2>
            {approverData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">Approver</th>
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">
                        Applications Handled
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">
                        Average Time (Hours)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {approverData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gov-text">{item.approver}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {item.totalHandled}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gov-text font-semibold">{item.avgHours.toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gov-text-light">
                No approver data available
              </div>
            )}
          </div>

          {/* Inbox Backlog Table */}
          <div className="gov-card p-6">
            <h2 className="text-xl font-semibold text-gov-text mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-primary" />
              Inbox Backlog Analysis
            </h2>
            {backlogData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">Approver</th>
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">Application ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">
                        Hours Waiting
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gov-text">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backlogData.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          item.hoursWaiting > 24 ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-gov-text">{item.approver}</td>
                        <td className="py-3 px-4 font-mono text-sm">{item.cofOId}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              item.hoursWaiting > 24 ? "text-red-600" : "text-gov-text"
                            }`}
                          >
                            {item.hoursWaiting.toFixed(1)}h
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gov-text-light">
                No backlog data available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  color,
  suffix = "",
}) => (
  <div className="gov-card p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gov-text-light text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gov-text">
          {value}
          {suffix}
        </p>
      </div>
      <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
    </div>
  </div>
);

export default Reports;
