import useSWR from "swr";
import {
  getApprovalApplications,
  getCofOForReview,
  ApplicationListItem,
  ApplicationForReview,
} from "../api/approvalsApi";

/**
 * Hook to fetch applications for approval
 */
export const useApprovalApplications = () => {
  const { data, error, isLoading, mutate } = useSWR<ApplicationListItem[]>(
    "/approvals/applications",
    () => getApprovalApplications(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );
  console.log(data)
  return {
    applications: data || [],
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch single application for review
 */
export const useCofOForReview = (applicationId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ApplicationForReview>(
    applicationId ? `/approvals/application/${applicationId}` : null,
    () => applicationId ? getCofOForReview(applicationId) : Promise.reject("No ID"),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      focusThrottleInterval: 60000,
    }
  );

  return {
    application: data,
    error,
    isLoading,
    mutate,
  };
};
