import StarMotif from "@/components/ui/StarMotif";

/** Pemisah: garis tipis dengan satu bintang kecil di tengah. */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-gold-500 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-50" />
      <StarMotif className="h-5 w-5" strokeWidth={3} />
      <span className="h-px flex-1 bg-current opacity-50" />
    </div>
  );
}
