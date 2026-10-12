"use client";

import { useState } from "react";

import { useAdmin } from "../AdminProvider";
import { PlayIcon } from "../icons";
import { Avatar, Button, Card, EmptyState, Field, PageHeader, Pill, Tabs, formatDateTime, inputClass } from "../ui";
import { api } from "@/lib/api";
import type { Astrologer, AstrologerList } from "@/lib/types";
import { useLoad } from "@/lib/useLoad";

type Status = "pending" | "approved" | "all";

export function Astrologers() {
  const { token } = useAdmin();
  const [status, setStatus] = useState<Status>("pending");
  const { data, error, loading, reload } = useLoad<AstrologerList>(`/api/admin/astrologers?status=${status}`, token);

  return (
    <>
      <PageHeader title="Astrologers" subtitle="Review new astrologers, approve them and set their rate and commission." />

      <Tabs
        value={status}
        onChange={setStatus}
        tabs={[
          { key: "pending", label: "Pending approval", count: data?.counts.pending },
          { key: "approved", label: "Approved", count: data?.counts.approved },
          { key: "all", label: "All" },
        ]}
      />

      {loading && !data ? (
        <p className="py-14 text-center text-sm text-ink/50">Loading…</p>
      ) : error && !data ? (
        <EmptyState title="Couldn't load astrologers" text={error} />
      ) : !data?.astrologers.length ? (
        <EmptyState
          title={status === "pending" ? "No one is waiting for approval" : "No astrologers here"}
          text={status === "pending" ? "New sign-ups from the astrologer portal will show here." : undefined}
        />
      ) : (
        <div className={`space-y-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
          {data.astrologers.map((a) => (
            // Keyed by id + values so the form resets after a save.
            <AstrologerCard
              key={`${a.astrologer_id}-${a.approved}-${a.price}-${a.revenue_share_percent}`}
              astrologer={a}
              onChanged={reload}
            />
          ))}
        </div>
      )}
    </>
  );
}

function AstrologerCard({ astrologer: a, onChanged }: { astrologer: Astrologer; onChanged: () => void }) {
  const { token } = useAdmin();
  const approved = a.approved !== false;
  const [price, setPrice] = useState(a.price ? String(a.price) : "");
  const [share, setShare] = useState(a.revenue_share_percent != null ? String(a.revenue_share_percent) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(!approved);

  const save = async (makeApproved: boolean) => {
    setError("");
    const priceValue = Number(price);
    const shareValue = share.trim() === "" ? null : Number(share);

    if (makeApproved && !(Number.isInteger(priceValue) && priceValue > 0)) {
      setError("Set a price per minute (a whole number above 0) before approving.");
      return;
    }
    if (shareValue !== null && !(shareValue >= 0 && shareValue <= 100)) {
      setError("Commission must be between 0 and 100%.");
      return;
    }

    setBusy(true);
    try {
      await api(`/api/astrologers/${a.astrologer_id}`, {
        token,
        method: "PUT",
        body: {
          approved: makeApproved,
          ...(priceValue > 0 ? { price: priceValue } : {}),
          ...(shareValue !== null ? { revenue_share_percent: shareValue } : {}),
        },
      });
      onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!window.confirm(`Revoke approval for ${a.name}? They'll go offline and disappear from the app.`)) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/astrologers/${a.astrologer_id}`, { token, method: "PUT", body: { approved: false } });
      onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const video = a.media?.find((m) => m.kind === "video");
  const images = a.media?.filter((m) => m.kind === "image") ?? [];

  return (
    <Card>
      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={a.name} photo={a.photo} size={64} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-ink">{a.name}</h2>
            {approved ? <Pill tone="green">Approved</Pill> : <Pill tone="amber">Pending approval</Pill>}
            {!a.photo && <Pill tone="zinc">No photo</Pill>}
          </div>
          <div className="mt-0.5 text-sm text-ink/60">
            {a.type} · {a.experience ?? 0}+ years
            {a.tagline ? <span className="italic"> · “{a.tagline}”</span> : null}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
            <span>📞 {a.phoneNumber || "—"}</span>
            <span>Joined {formatDateTime(a.created_at)}</span>
            {approved && <span>₹{a.price ?? "—"}/min</span>}
            {approved && <span>Commission {a.revenue_share_percent ?? "not set"}{a.revenue_share_percent != null ? "%" : ""}</span>}
          </div>
        </div>

        <Button variant="ghost" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Hide details" : "Details"}
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 grid gap-5 border-t border-primary/8 pt-4 lg:grid-cols-[1fr_320px]">
          {/* What users will see */}
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink/45">About</div>
              <p className="mt-1 whitespace-pre-wrap text-ink/80">{a.description || "—"}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink/45">Greeting</div>
              <p className="mt-1 text-ink/80">{a.greetings || "—"}</p>
            </div>
            {!!a.specialties?.length && (
              <div className="flex flex-wrap gap-1.5">
                {a.specialties.map((s) => (
                  <Pill key={s} tone="violet">
                    {s}
                  </Pill>
                ))}
              </div>
            )}
            {!!a.languages?.length && <div className="text-ink/60">Languages: {a.languages.join(", ")}</div>}
            {(video || images.length > 0) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {video && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-20 w-28 items-center justify-center gap-1 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary-dark"
                  >
                    <PlayIcon className="h-5 w-5" /> Intro video
                  </a>
                )}
                {images.map((m) => (
                  <a key={m.url} href={m.url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote photos from the bucket */}
                    <img src={m.url} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Approval */}
          <div className="space-y-3 rounded-2xl bg-lavender/60 p-4">
            <Field label="Price per minute (₹)" htmlFor={`price-${a.astrologer_id}`} hint="What users pay per minute of chat.">
              <input
                id={`price-${a.astrologer_id}`}
                type="number"
                min={1}
                step={1}
                className={inputClass}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 10"
              />
            </Field>
            <Field
              label="Astrologer's share (%)"
              htmlFor={`share-${a.astrologer_id}`}
              hint="Their cut of what users pay. Leave empty to use the default."
            >
              <input
                id={`share-${a.astrologer_id}`}
                type="number"
                min={0}
                max={100}
                step={0.5}
                className={inputClass}
                value={share}
                onChange={(e) => setShare(e.target.value)}
                placeholder="e.g. 60"
              />
            </Field>

            <div className="flex flex-wrap gap-2 pt-1">
              {approved ? (
                <>
                  <Button onClick={() => save(true)} disabled={busy}>
                    {busy ? "Saving…" : "Save changes"}
                  </Button>
                  <Button variant="danger" onClick={revoke} disabled={busy}>
                    Revoke approval
                  </Button>
                </>
              ) : (
                <Button onClick={() => save(true)} disabled={busy} className="w-full">
                  {busy ? "Approving…" : "Approve"}
                </Button>
              )}
            </div>
            {error && (
              <p className="text-sm text-rose-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
