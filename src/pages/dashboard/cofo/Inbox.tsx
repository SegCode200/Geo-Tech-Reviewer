import { FaInbox } from "react-icons/fa";
import { useMyInboxTasks } from "../../../hooks/useDashboard";

const Inbox = () => {
  const { tasks, isLoading } = useMyInboxTasks();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Inbox</h1>
        <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">Messages related to Certificate applications</p>
      </div>

      <div className="gov-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaInbox className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Recent Messages</h2>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <div className="text-center py-8 text-gov-text-light">Loading messages...</div>
          )}

          {!isLoading && tasks.length === 0 && (
            <div className="text-center py-8 text-gov-text-light">No messages</div>
          )}

          {!isLoading && tasks.map((t) => (
            <div key={t.id} className="border border-gov-border rounded-gov p-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-primary truncate">{t.cofO?.applicationNumber || t.id}</p>
                <p className="text-xs text-gov-text-light">From: {t.cofO?.user?.email || 'system'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gov-text-light">{new Date(t.timestamp).toLocaleDateString()}</p>
                <span className={`gov-badge ${t.status === 'pending' ? 'gov-badge-warning' : 'gov-badge-info'} mt-2`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
