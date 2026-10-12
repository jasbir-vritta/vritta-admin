"use client";

import { useState } from "react";

import { useAdmin } from "../AdminProvider";
import { Button, Card, EmptyState, PageHeader, Pill, Tabs, formatDateTime, inputClass } from "../ui";
import { api } from "@/lib/api";
import type { SupportList, SupportTicket } from "@/lib/types";
import { useLoad } from "@/lib/useLoad";

type Status = "open" | "closed" | "all";

export function Support() {
  const { token } = useAdmin();
  const [status, setStatus] = useState<Status>("open");
  const { data, error, loading, reload } = useLoad<SupportList>(`/api/admin/support?status=${status}`, token);

  return (
    <>
      <PageHeader title="Support" subtitle="Requests astrologers sent from Help & Support in their portal." />

      <Tabs
        value={status}
        onChange={setStatus}
        tabs={[
          { key: "open", label: "Open", count: data?.open_count },
          { key: "closed", label: "Closed" },
          { key: "all", label: "All" },
        ]}
      />

      {loading && !data ? (
        <p className="py-14 text-center text-sm text-ink/50">Loading…</p>
      ) : error && !data ? (
        <EmptyState title="Couldn't load support requests" text={error} />
      ) : !data?.tickets.length ? (
        <EmptyState title={status === "open" ? "No open requests" : "Nothing here"} />
      ) : (
        <div className={`space-y-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
          {data.tickets.map((t) => (
            <TicketCard key={`${t.ticket_id}-${t.status}-${t.reply ?? ""}`} ticket={t} onChanged={reload} />
          ))}
        </div>
      )}
    </>
  );
}

function TicketCard({ ticket: t, onChanged }: { ticket: SupportTicket; onChanged: () => void }) {
  const { token } = useAdmin();
  const [reply, setReply] = useState(t.reply ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = async (body: { reply?: string; status?: "open" | "closed" }) => {
    setBusy(true);
    setError("");
    try {
      await api(`/api/admin/support/${t.ticket_id}`, { token, method: "PATCH", body });
      onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-ink">{t.subject}</span>
        {t.status === "open" ? <Pill tone="amber">Open</Pill> : <Pill tone="green">Closed</Pill>}
        <span className="text-xs text-ink/45">{formatDateTime(t.created_at)}</span>
      </div>
      <div className="mt-1 text-xs text-ink/55">
        {t.name || "Astrologer"} · 📞 {t.phoneNumber || "—"}
      </div>
      <p className="mt-3 whitespace-pre-wrap rounded-xl bg-lavender/60 px-4 py-3 text-sm text-ink">{t.message}</p>

      <div className="mt-3">
        <label htmlFor={`reply-${t.ticket_id}`} className="mb-1.5 block text-sm font-semibold text-ink">
          Reply <span className="font-normal text-ink/45">(shown to the astrologer in their portal)</span>
        </label>
        <textarea
          id={`reply-${t.ticket_id}`}
          className={inputClass}
          rows={3}
          maxLength={2000}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply…"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button onClick={() => update({ reply, status: "closed" })} disabled={busy || !reply.trim()}>
          {busy ? "Saving…" : "Send reply & close"}
        </Button>
        {t.status === "open" ? (
          <Button variant="outline" onClick={() => update({ status: "closed" })} disabled={busy}>
            Close without reply
          </Button>
        ) : (
          <Button variant="outline" onClick={() => update({ status: "open" })} disabled={busy}>
            Reopen
          </Button>
        )}
        {error && (
          <span className="text-sm text-rose-600" role="alert">
            {error}
          </span>
        )}
      </div>
    </Card>
  );
}
