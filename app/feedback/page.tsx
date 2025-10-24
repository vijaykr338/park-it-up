"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FeedbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const ref = params.get("ref") || "BK202509041555";
  const spot = params.get("spot") || "P10";

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    // Placeholder: send to backend later
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    router.push("/map");
  };

  return (
    <div className="min-h-screen bg-[#0a121a] text-white">
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">How was your experience?</h1>
        <p className="text-gray-300 mb-6">Reservation {ref} • Pacific Mall — Spot {spot}</p>

        <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-5 space-y-5">
          <div>
            <div className="text-sm text-gray-300 mb-2">Rate our service</div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={[
                    "h-10 w-10 rounded-full border",
                    n <= rating ? "bg-[#4d84a4] border-[#4d84a4]" : "bg-transparent border-[#4d84a4]/40",
                  ].join(" ")}
                  aria-label={`Rate ${n} star${n>1?"s":""}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-300 mb-2">Tell us more (optional)</div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg bg-[#0b1320] border border-[#4d84a4]/30 p-3 outline-none focus:ring-2 focus:ring-[#4d84a4]/40"
              placeholder="What went well? What can we improve?"
            />
          </div>

          <button
            disabled={submitting || rating === 0}
            onClick={onSubmit}
            className="w-full rounded-lg bg-[#4d84a4] px-5 py-3 font-semibold hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}


