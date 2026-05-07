import useSWR from "swr";
import {
  getApprovalApplications,
  getCofOForReview,
  getLandForReview,
  LandForReview,
  ApplicationForReview,
  ReviewerApplicationsResponse,
} from "../api/approvalsApi";

/**
 * Hook to fetch applications for approval
 */
export const useApprovalApplications = () => {
  const { data, error, isLoading, mutate } = useSWR<ReviewerApplicationsResponse>(
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
    applications: data?.applications || [],
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

export const useLandForReview = (landId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<LandForReview>(
    landId ? `/internal-users/reviewer/land-review/${landId}` : null,
    () => landId ? getLandForReview(landId) : Promise.reject("No ID"),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      focusThrottleInterval: 60000,
    }
  );

  return {
    land: data,
    error,
    isLoading,
    mutate,
  };
};
