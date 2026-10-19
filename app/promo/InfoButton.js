"use client";

// Circled "i" button — smooth-scrolls to the features strip.
export default function InfoButton() {
  return (
    <button
      onClick={() =>
        document.getElementById("promo-features")?.scrollIntoView({ behavior: "smooth" })
      }
      aria-label="Learn more about features"
      className="mt-7 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 font-serif text-xl font-bold italic text-white/90 shadow-[0_0_18px_rgba(255,255,255,.25)] transition hover:scale-105 hover:bg-white/10"
    >
      i
    </button>
  );
}
