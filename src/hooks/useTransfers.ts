import useSWR from "swr";
import {
  getTransfersForReview,
  getTransferForReview,
  TransferListItem,
  Transfer,
} from "../api/transferApi";

/**
 * Hook to fetch transfers for review
 */
export const useTransfersForReview = () => {
  const { data, error, isLoading, mutate } = useSWR<{ transfers: TransferListItem[] }>(
    "/transfers/review",
    () => getTransfersForReview(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return {
    transfers: data?.transfers || [],
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch single transfer for review
 */
export const useTransferForReview = (transferId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<{ transfer: Transfer }>(
    transferId ? `/transfers/review/${transferId}` : null,
    () => transferId ? getTransferForReview(transferId) : Promise.reject("No ID"),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      focusThrottleInterval: 60000,
    }
  );

  return {
    transfer: data?.transfer,
    error,
    isLoading,
    mutate,
  };
};