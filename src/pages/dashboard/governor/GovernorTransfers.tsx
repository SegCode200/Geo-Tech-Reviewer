import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { listTransfersForGovernor, GovernorTransfer } from "../../../api/dashboardApi";
import { FaFileContract, FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight } from "react-icons/fa";

const GovernorTransfers: React.FC = () => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [transfers, setTransfers] = useState<GovernorTransfer[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await listTransfersForGovernor();
        setSummary(res.summary);
        setTransfers(res.transfers?.all || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (user?.role?.toLowerCase() !== "governor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">Only governors can access this page.</p>
        </div>
      </div>
    );
  }



  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING_GOVERNOR":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransfers = transfers.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return t.status === "PENDING_GOVERNOR";
    if (activeTab === "approved") return t.status === "APPROVED";
    if (activeTab === "rejected") return t.status === "REJECTED";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaFileContract className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Ownership Transfer Review</h1>
          </div>
          <p className="text-gray-600">Manage and review land ownership transfer requests</p>
        </div>

        {/* Stats Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total", value: summary.total, icon: FaFileContract, color: "indigo" },
              { label: "Pending", value: summary.pending, icon: FaClock, color: "yellow" },
              { label: "Approved", value: summary.approved, icon: FaCheckCircle, color: "green" },
              { label: "Rejected", value: summary.rejected, icon: FaTimesCircle, color: "red" },
            ].map((stat) => (
              <div key={stat.label} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-lg shadow-sm p-6 border border-${stat.color}-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 text-${stat.color}-400 opacity-50`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-wrap">
            {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-indigo-600 border-indigo-600"
                    : "text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Transfers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <FaFileContract className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-gray-600 mt-4">Loading transfers...</p>
          </div>
        ) : filteredTransfers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <FaFileContract className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No transfers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransfers.map((transfer) => (
              <Link
                key={transfer.id}
                to={`/dashboard/governor/transfers/${transfer.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-indigo-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-gray-500">{transfer.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transfer.status)}`}>
                          {transfer.status?.replace(/_/g, " ") || "Unknown"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {transfer.land?.address || `Land at ${transfer.land?.latitude}, ${transfer.land?.longitude}`}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">From:</span> {transfer.currentOwner?.fullName || "Unknown"}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">To:</span> {transfer.newOwnerEmail || transfer.newOwnerPhone || "TBD"}
                        </div>
                        {transfer.land?.squareMeters && (
                          <div className="text-gray-600">
                            <span className="font-medium">Size:</span> {transfer.land.squareMeters}m²
                          </div>
                        )}
                        <div className="text-gray-600">
                          <span className="font-medium">Date:</span> {new Date(transfer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <FaArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernorTransfers;
