/** Gelombang lembut yang menyambung bagian gelap ke bagian terang di atasnya. Letakkan di dalam section gelap (relative). */
export default function Wave({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1440 80" preserveAspectRatio="none" className={`wave pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] ${className}`}>
      <path d="M0 80V44C180 8 360 4 560 30c200 26 380 40 560 18 130-16 230-34 320-48v80Z" />
    </svg>
  );
}
