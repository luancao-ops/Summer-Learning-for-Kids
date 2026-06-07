"use client";

export function SpeakButton({ text, size = "md" }: { text: string; size?: "sm" | "md" }) {
  function speak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  }
  return (
    <button
      type="button"
      onClick={speak}
      title="Nghe phát âm tiếng Anh"
      aria-label="Nghe phát âm"
      style={{ touchAction: "manipulation" }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-90 hover:scale-110 ${
        size === "sm" ? "h-7 w-7 text-base" : "h-9 w-9 text-xl"
      }`}
    >
      🔊
    </button>
  );
}
