import useSWR from "swr";
import {
  getDashboardStats,
  getCofOActivityLogs,
  getReviewerApplications,
  getCofOMonthlyTrends,
  getMyInboxTasks,
  getGovernorStatusReport,
  getGovernorProcessingTimeReport,
  getGovernorLocationReport,
  getGovernorTrendReport,
  getGovernorReviewerPerformance,
  getGovernorApproverPerformance,
  getGovernorStageDelayReport,
  getGovernorInboxBacklog,
  DashboardStats,
  AuditLog,
  ReviewerApplication,
  MonthlyTrend,
  InboxTask,
  GovernorStatusReport,
  ProcessingTimeReport,
  LocationReport,
  TrendReport,
  ReviewerPerformance,
  ApproverPerformance,
  StageDelayReport,
  InboxBacklogItem,
  getGovernorCofOs,
  getGovernorCofO,
  GovernorCofOItem,
  GovernorCofODetail,
} from "../api/dashboardApi";

/**
 * Hook to fetch dashboard statistics
 * @returns SWR response with data, error, and loading state
 */
export const useDashboardStats = (role?: string) => {
  const key = role ? ["/dashboard/stats", role] : "/dashboard/stats";
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    key,
    () => getDashboardStats(role),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000, // 5 minutes
    }
  );

  return {
    stats: data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch CofO activity logs
 * @returns SWR response with logs, error, and loading state
 */
export const useCofOActivityLogs = () => {
  const { data, error, isLoading, mutate } = useSWR<AuditLog[]>(
    "/dashboard/activity-logs",
    () => getCofOActivityLogs(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return {
    logs: data || [],
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch reviewer applications
 * @returns SWR response with applications, error, and loading state
 */
export const useReviewerApplications = () => {
  const { data, error, isLoading, mutate } = useSWR<ReviewerApplication[]>(
    "/dashboard/applications",
    () => getReviewerApplications(),
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
 * Hook to fetch monthly CofO trends
 * @returns SWR response with trends data, error, and loading state
 */
export const useCofOMonthlyTrends = () => {
  const { data, error, isLoading, mutate } = useSWR<MonthlyTrend[]>(
    "/dashboard/trends/monthly",
    () => getCofOMonthlyTrends(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return {
    trends: data || [],
    error,
    isLoading,
    mutate,
  };
};

/**
 * Hook to fetch inbox tasks
 * @returns SWR response with inbox tasks, error, and loading state
 */
export const useMyInboxTasks = () => {
  const { data, error, isLoading, mutate } = useSWR<InboxTask[]>(
    "/inbox/tasks",
    () => getMyInboxTasks(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds for inbox (more frequent updates)
      focusThrottleInterval: 60000,
    }
  );

  return {
    tasks: data || [],
    error,
    isLoading,
    mutate,
  };
};

// Governor Report Hooks

export const useGovernorStatusReport = () => {
  const { data, error, isLoading, mutate } = useSWR<GovernorStatusReport>(
    "/reports/governor/status",
    () => getGovernorStatusReport(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorProcessingTimeReport = () => {
  const { data, error, isLoading, mutate } = useSWR<ProcessingTimeReport>(
    "/reports/governor/processing-time",
    () => getGovernorProcessingTimeReport(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorLocationReport = () => {
  const { data, error, isLoading, mutate } = useSWR<LocationReport[]>(
    "/reports/governor/location",
    () => getGovernorLocationReport(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorTrendReport = () => {
  const { data, error, isLoading, mutate } = useSWR<TrendReport>(
    "/reports/governor/trend",
    () => getGovernorTrendReport(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorReviewerPerformance = () => {
  const { data, error, isLoading, mutate } = useSWR<ReviewerPerformance[]>(
    "/reports/governor/reviewer-performance",
    () => getGovernorReviewerPerformance(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorApproverPerformance = () => {
  const { data, error, isLoading, mutate } = useSWR<ApproverPerformance[]>(
    "/reports/governor/approver-performance",
    () => getGovernorApproverPerformance(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorStageDelayReport = () => {
  const { data, error, isLoading, mutate } = useSWR<StageDelayReport[]>(
    "/reports/governor/stage-delay",
    () => getGovernorStageDelayReport(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return { data, error, isLoading, mutate };
};

export const useGovernorInboxBacklog = () => {
  const { data, error, isLoading, mutate } = useSWR<InboxBacklogItem[]>(
    "/reports/governor/inbox-backlog",
    () => getGovernorInboxBacklog(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      focusThrottleInterval: 60000,
    }
  );

  return { data, error, isLoading, mutate };
};

// Governor CofO list (approved or filtered)
export const useGovernorCofOs = (status?: string, page?: number, limit?: number) => {
  const key = status ? ["/governor/cofos", status, page, limit] : ["/governor/cofos", page, limit];
  const { data, error, isLoading, mutate } = useSWR<{ results: GovernorCofOItem[]; meta?: { total: number; page: number; limit: number } }>(
    key,
    () => getGovernorCofOs( page, limit),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  return { cofos: data?.results || [], meta: data?.meta, error, isLoading, mutate };
};

export const useGovernorCofO = (id?: string | null) => {
  const swrKey = id ? `/governor/cofo/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<GovernorCofODetail>(
    swrKey,
    () => (id ? getGovernorCofO(id) : Promise.reject("No id")),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return { cofo: data?.cofO || null, error, isLoading, mutate };
};
