import axios from "axios";

const API_URL = "https://geo-tech-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface CofODocument {
  id: string;
  name: string;
  url: string;
  type: string;
  title: string;
  uploadedAt: string;
  status: string; // e.g. PENDING | APPROVED | REJECTED
}

export const updateCofODocumentStatus = async (documentId: string, status: "APPROVED" | "REJECTED", rejectionMessage?:string) => {
  const res = await api.post(`/internal-users/approve-document/${documentId}`, { status, rejectionMessage });
  return res.data;
};

export interface ApprovalAudit {
  id: string;
  createdAt: string;
  status: string;
  comment?: string;
  cofO: {
    id: string;
    applicationNumber: string;
  };
}

export interface ApplicationForReview {
  id: string;
  applicationNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  land: {
    id: string;
    address: string;
    state: {
      id: string;
      name: string;
    };
  };
  cofODocuments: CofODocument[];
  cofOAuditLogs: any[];
  InboxMessage: any[];
  approvalAudits: ApprovalAudit[];
}

export interface ApplicationListItem {
  id: string;
  status: string;
  createdAt: string;
  address: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  land: {
    id: string;
    state: {
      id: string;
      name: string;
      address: string;
    };
  };
  logs: any[];
}

export const getApprovalApplications = async (): Promise<ApplicationListItem[]> => {
  const res = await api.get("/internal-users/reviewer/applications");
  return res.data;
};

export const getCofOForReview = async (id: string): Promise<ApplicationForReview> => {
  const res = await api.get(`/internal-users/review/${id}`);
  return res.data;
};

export const submitApprovalDecision = async (
  applicationId: string,
  data: {
    action: "APPROVE" | "REJECT";
    message?: string;
    plotNumber?: string;
  }
): Promise<ApprovalAudit> => {
  const res = await api.post(`/cofo/review/${applicationId}`, data);
  return res.data;
};
