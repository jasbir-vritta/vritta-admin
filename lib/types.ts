export type MediaItem = { url: string; kind: "image" | "video" };

export type Astrologer = {
  astrologer_id: string;
  name: string;
  type: string;
  experience?: number;
  description?: string;
  greetings?: string;
  tagline?: string | null;
  specialties?: string[];
  languages?: string[];
  photo?: string | null;
  media?: MediaItem[];
  price?: number | null;
  // The astrologer's share of what users pay, in percent.
  revenue_share_percent?: number | null;
  approved?: boolean;
  online?: boolean;
  phoneNumber?: string | null;
  created_at?: string | null;
};

export type AstrologerList = {
  astrologers: Astrologer[];
  counts: { pending: number; approved: number };
};

export type SupportTicket = {
  ticket_id: string;
  astrologer_id: string;
  name?: string | null;
  phoneNumber?: string | null;
  subject: string;
  message: string;
  status: "open" | "closed";
  reply?: string | null;
  created_at?: string | null;
  replied_at?: string | null;
};

export type SupportList = { tickets: SupportTicket[]; open_count: number };
