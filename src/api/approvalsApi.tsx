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

export interface LandReviewTask {
  id: string;
  landCode?: string;
  landStatus?: string;
  owner?: {
    fullName?: string;
    email?: string;
  };
  state?: {
    id: string;
    name?: string;
  };
}

export interface ReviewerApplicationsResponse {
  applications: ApplicationListItem[];
  landReviewTasks: LandReviewTask[];
}

export const getApprovalApplications = async (): Promise<ReviewerApplicationsResponse> => {
  const res = await api.get("/internal-users/reviewer/applications");
  return res.data;
};

export const getCofOForReview = async (id: string): Promise<ApplicationForReview> => {
  const res = await api.get(`/internal-users/review/${id}`);
  return res.data;
};

export interface Bearing {
  bearing: number;
  distance: number;
}

export interface LandDocument {
  createdAt: string;
  documentUrl: string;
  fileName: string;
  id: string;
  isActive: boolean;
  landId: string;
  replacedById: string | null;
}

export interface LandOwner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  // Add other fields as needed
}

export interface LandState {
  createdAt: string;
  governorId: string;
  id: string;
  name: string;
}

export interface LandForReview {
  id: string;
  accuracyLevel: string;
  address: string;
  areaSqm: number;
  bearings: Bearing[];
  centerLat: number;
  centerLng: number;
  conflictFlags: any; // null or specific type
  createdAt: string;
  currentReviewerId: string;
  documents: LandDocument[];
  existingCofODocument: any; // null or specific type
  existingCofOIssueDate: string;
  existingCofONumber: string;
  hasExistingCofO: boolean;
  isVerified: boolean;
  landCode: string;
  landStatus: string;
  latlngCoordinates: [number, number][];
  owner: LandOwner;
  ownerId: string;
  ownerName: string;
  ownershipType: string;
  parentLandId: string | null;
  plotNumber: string | null;
  purpose: string;
  requiresReviewerApproval: boolean;
  reviewLogs: any[]; // empty array
  startPoint: [number, number];
  state: LandState;
  stateId: string;
  surveyDate: string;
  surveyNotes: string | null;
  surveyPlanNumber: string;
  surveyTelephone: string;
  surveyType: string;
  surveyorAddress: string;
  surveyorName: string;
  titleType: string;
  utmCoordinates: [number, number][];
  utmZone: string;
}

export const getLandForReview = async (id: string): Promise<LandForReview> => {
  const res = await api.get(`/internal-users/land-review/${id}`);
  console.log(res.data)
  return res.data.land;
};

export const submitLandReviewDecision = async (
  landId: string,
  data: {
    action: "APPROVE" | "REJECT";
    message?: string;
  }
) => {
  const res = await api.post(`/internal-users/land-review/${landId}`, data);
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
