import axios from "axios";
import { CofODocument } from "./approvalsApi";

const API_URL = "https://geo-tech-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  needsCorrection: number;
  rejected: number;
  // Optional reviewer-specific fields (backend may return these for reviewer role)
  completed?: number;
  resubmitted?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  createdAt: string;
  cofOId: string;
  cofO: {
    id: string;
    status: string;
  };
}

export interface ReviewerApplication {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
  land: {
    id: string;
    state: {
      id: string;
      name: string;
    };
  };
  logs: AuditLog[];
}

export interface MonthlyTrend {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
}

export interface InboxTask {
  id: string;
  timestamp: string;
  status: string;
  receiverId: string;
  cofOId: string;
  cofO: {
    id: string;
    applicationNumber: string;
    status: string;
    createdAt: string;
    cofODocuments: unknown[];
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    land: {
      id: string;
      documents: unknown[];
      state: {
        id: string;
        name: string;
      };
    };
  };
}

export const getDashboardStats = async (role?: string): Promise<DashboardStats> => {
  const r = role ? role.toString().toLowerCase() : "";

  // Choose endpoint based on role
  let path = "/internal-users/dashboard";
  if (r.includes("reviewer")) path = "/internal-users/dashboard";
  else if (r.includes("governor")) path = "/internal-users/dashboard/governor";

  const res = await api.get(path);
  const d = res.data || {};

  // Normalize shape so UI has consistent fields regardless of role
  return {
    total: d.total ?? 0,
    pending: d.pending ?? 0,
    approved: d.approved ?? 0,
    needsCorrection: d.needsCorrection ?? 0,
    rejected: d.rejected ?? 0,
    completed: d.completed ?? d.COMPLETED ?? 0,
    resubmitted: d.resubmitted ?? d.RESUBMITTED ?? 0,
  };
};

export const getCofOActivityLogs = async (): Promise<AuditLog[]> => {
  const res = await api.get("/internal-users/activity");
  return res.data;
};

export const getReviewerApplications = async (): Promise<ReviewerApplication[]> => {
  const res = await api.get("/internal-users/reviewer/applications");
  return res.data;
};

export const getCofOMonthlyTrends = async (): Promise<MonthlyTrend[]> => {
  const res = await api.get("/internal-users/monthly-trends");
  return res.data;
};

export const getMyInboxTasks = async (): Promise<InboxTask[]> => {
  const res = await api.get("/internal-users/inbox/my-tasks");
  return res.data;
};

// Governor Reports
export interface GovernorStatusReport {
  total: number;
  inReview: number;
  needsCorrection: number;
  resubmitted: number;
  approved: number;
  rejected: number;
}

export interface ProcessingTimeReport {
  approvedCount: number;
  averageProcessingDays: number;
}

export interface LocationReport {
  total: number;
}

export interface TrendReport {
  [key: string]: number;
}

export interface ReviewerPerformance {
  reviewer: string;
  handled: number;
  corrections: number;
}

export interface ApproverPerformance {
  approver: string;
  totalHandled: number;
  avgHours: number;
}

export interface StageDelayReport {
  stage: number;
  avgHours: number;
  totalHandled: number;
}

export interface InboxBacklogItem {
  approver: string;
  cofOId: string;
  hoursWaiting: number;
  status: string;
}

export const getGovernorStatusReport = async (): Promise<GovernorStatusReport> => {
  const res = await api.get("internal-users/reports/status");
  return res.data;
};

export const getGovernorProcessingTimeReport = async (): Promise<ProcessingTimeReport> => {
  const res = await api.get("internal-users/reports/processing-time");
  return res.data;
};

export const getGovernorLocationReport = async (): Promise<LocationReport[]> => {
  const res = await api.get("internal-users/reports/location");
  return res.data;
};

export const getGovernorTrendReport = async (): Promise<TrendReport> => {
  const res = await api.get("internal-users/reports/trends");
  return res.data;
};

export const getGovernorReviewerPerformance = async (): Promise<ReviewerPerformance[]> => {
  const res = await api.get("internal-users/reports/reviewer-performance");
  return res.data;
};

export const getGovernorApproverPerformance = async (): Promise<ApproverPerformance[]> => {
  const res = await api.get("internal-users/governor/reports/approver-performance");
  return res.data;
};

export const getGovernorStageDelayReport = async (): Promise<StageDelayReport[]> => {
  const res = await api.get("internal-users/governor/reports/stage-delays");
  return res.data;
};

export const getGovernorInboxBacklog = async (): Promise<InboxBacklogItem[]> => {
  const res = await api.get("internal-users/governor/reports/inbox-backlog");
  return res.data;
};

// Governor CofO list + detail
export interface GovernorCofOItem {
  id: string;
  applicationNumber?: string;
  status: string;
  createdAt: string;
  user?: { id: string; fullName?: string; firstName?: string; lastName?: string; email?: string };
  land?: { id: string; address?: string; stateId?: string; state?: { id: string; name?: string } };
  cofODocuments?: CofODocument[];
  logs?: any[];
}

export interface GovernorCofODetail extends GovernorCofOItem {
  cofODocuments: CofODocument[];
  logs: any[];
  currentReviewer?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    department?: string;
    ministry?: string;
  };
  cofONumber?: string | null;
  governorSignatureUrl?: string | null;
  signedAt?: string | null;
  revisionCount?: number;
  rejectedById?: string | null;
  approvedById?: string | null;
}

export const getGovernorCofOs = async ( page?: number, limit?: number): Promise<{ results: GovernorCofOItem[]; meta?: { total: number; page: number; limit: number } }> => {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const res = await api.get("/cofo/governor/cofos", { params });
  return res.data;
};

export const getGovernorCofO = async (id: string): Promise<GovernorCofODetail> => {
  const res = await api.get(`/cofo/governor/cofo/${id}`);
  console.log(res.data)
  return res.data;
};

// Governor Transfers (ownership transfer review)
export interface GovernorTransferDocument {
  id: string;
  title?: string;
  type?: string;
  url?: string | null;
  status?: string;
  rejectionMessage?: string | null;
  transferId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GovernorTransfer {
  id: string;
  status: string;
  createdAt: string;
  land: {
    id: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    squareMeters?: number | null;
    state?: { id?: string; name?: string; governorId?: string };
  };
  currentOwner?: { id: string; fullName?: string; email?: string } | null;
  newOwnerEmail?: string | null;
  newOwnerPhone?: string | null;
  documents?: GovernorTransferDocument[];
}

export const listTransfersForGovernor = async (): Promise<{
  summary: { total: number; pending: number; approved: number; rejected: number };
  transfers: { pending: GovernorTransfer[]; approved: GovernorTransfer[]; rejected: GovernorTransfer[]; all: GovernorTransfer[] };
}> => {
  const res = await api.get("/ownership/governor/list");
  return res.data;
};

export const getTransferForReview = async (transferId: string): Promise<{ transfer: GovernorTransfer }> => {
  const res = await api.get(`/ownership/governor/review/${transferId}`);
  return res.data;
};

export const approveOwnershipTransfer = async (transferId: string, governorComment?: string) => {
  const res = await api.post(`/ownership/${transferId}/approve`, { governorComment });
  return res.data;
};

export const rejectOwnershipTransfer = async (transferId: string, rejectionReason: string, governorComment?: string) => {
  const res = await api.post(`/ownership/${transferId}/reject`, { rejectionReason, governorComment });
  return res.data;
};

// Governor Document Approval/Rejection
export const approveDocument = async (documentId: string) => {
  const res = await api.post(`/ownership/document/${documentId}/approve`);
  return res.data;
};

export const rejectDocument = async (documentId: string, rejectionMessage: string) => {
  const res = await api.post(`/ownership/document/${documentId}/reject`, { rejectionMessage });
  return res.data;
};
