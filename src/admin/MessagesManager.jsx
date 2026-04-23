import { Mail } from "lucide-react";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCollection } from "../hooks/useCollection";
import { formatTimestamp } from "../utils/formatters";

const MessagesManager = () => {
  const { data: messages, loading } = useCollection("messages", {
    field: "createdAt",
    direction: "desc"
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
          Contact messages
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Inbox</h2>
      </div>

      {loading ? <LoadingSpinner label="Loading contact messages..." /> : null}

      <div className="space-y-4">
        {messages.map((message) => (
          <GlassPanel key={message.id} className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-rose-200">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{message.name}</p>
                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 block text-sm text-rose-200"
                  >
                    {message.email}
                  </a>
                  {message.emailNotification?.status ? (
                    <p className="mt-3 inline-flex rounded-lg border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      Email {message.emailNotification.status}
                    </p>
                  ) : null}
                  {message.emailNotification?.provider ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Via {message.emailNotification.provider}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
            {message.emailNotification?.responseMessage ? (
              <p className="mt-4 text-xs leading-6 text-slate-400">
                {message.emailNotification.responseMessage}
              </p>
            ) : null}
            {message.emailNotification?.error ? (
              <p className="mt-4 text-xs leading-6 text-amber-300">
                {message.emailNotification.error}
              </p>
            ) : null}
            <p className="mt-5 text-sm leading-7 text-slate-300">{message.message}</p>
          </GlassPanel>
        ))}

        {!messages.length ? (
          <GlassPanel className="p-6">
            <p className="text-sm text-slate-400">No messages yet.</p>
          </GlassPanel>
        ) : null}
      </div>
    </div>
  );
};

export default MessagesManager;
