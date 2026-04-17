import axios from "axios";

const API_URL = "https://geo-tech-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interfaces based on backend code
export interface TransferReview {
  id: string;
  documentId: string;
  reviewerId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionMessage?: string | null;
  reviewedAt?: string;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TransferDocument {
  id: string;
  transferId?: string;
  type?: string;
  title: string;
  url: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string;
  reviewedById?: string;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  };
  rejectionMessage?: string | null;
  reviews?: TransferReview[];
}

export interface TransferStage {
  id: string;
  stageNumber: number;
  status: string;
  arrivedAt: string;
  approvedAt?: string;
  message?: string;
  approver: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface Transfer {
  id: string;
  applicationNumber?: string;
  status: string;
  transferType: "FULL" | "PARTIAL";
  currentOwnerId?: string;
  currentReviewerId?: string;
  newOwnerId?: string;
  newOwnerEmail?: string;
  newOwnerPhone?: string;
  transferAreaSqm?: number;
  transferCenterLat?: number;
  transferCenterLng?: number;
  transferCoordinates?: number[][];
  transferBearings?: Array<{ bearing: number; distance: number }>;
  transferStartPoint?: [number, number];
  transferSurveyType?: string;
  transferUtmZone?: string;
  rejectionReason?: string;
  governorComment?: string;
  reviewedAt?: string;
  expiresAt?: string;
  createdAt: string;
  land: {
    id: string;
    landCode: string;
    address: string;
    areaSqm?: number;
    centerLat?: number;
    centerLng?: number;
    state?: {
      id: string;
      name: string;
    };
    ownerId?: string;
    ownerName?: string;
    ownershipType?: string;
    purpose?: string;
    titleType?: string;
    surveyType?: string;
    surveyDate?: string;
    surveyPlanNumber?: string;
    surveyTelephone?: string;
    surveyorName?: string;
    surveyorAddress?: string;
    utmZone?: string;
    utmCoordinates?: any;
    latlngCoordinates?: any;
    bearings?: Array<{ bearing: number; distance: number }>;
  };
  currentOwner: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
  };
  newOwner?: {
    id?: string;
    email?: string;
    fullName?: string;
    phone?: string;
  };
  documents: TransferDocument[];
  stages: TransferStage[];
  verifications?: any[];
}

export interface TransferListItem {
  id: string;
  status: string;
  createdAt: string;
  land: {
    id: string;
    address: string;
    state: {
      id: string;
      name: string;
    };
  };
  currentOwner: {
    id: string;
    email: string;
    fullName: string;
  };
  documents: TransferDocument[];
}

// API Functions
export const getTransfersForReview = async (): Promise<{ transfers: TransferListItem[] }> => {
  const res = await api.get("/ownership/for-review");
  return res.data;
};

export const reviewTransfer = async (data: {
  transferId: string;
  action: "APPROVE" | "REJECT";
  message?: string;
  signatureUrl?: string;
}) => {
  const res = await api.post(`/ownership/${data.transferId}/review`, data);
  return res.data;
};

export const getTransferForReview = async (transferId: string): Promise<{ transfer: Transfer }> => {
  const res = await api.get(`/ownership/${transferId}/review`);
  return res.data;
};

export const rejectOwnershipTransfer = async (transferId: string, reason: string) => {
  const res = await api.post(`/ownership/${transferId}/reject`, { reason });
  return res.data;
};

export const approveOwnershipTransfer = async (transferId: string) => {
  const res = await api.post(`/ownership/${transferId}/approve`);
  return res.data;
};

export const approveDocument = async (documentId: string) => {
  const res = await api.post(`/ownership/document/${documentId}/approve`);
  return res.data;
};

export const rejectDocument = async (documentId: string, reason: string) => {
  const res = await api.post(`/ownership/document/${documentId}/reject`, { reason });
  return res.data;
};