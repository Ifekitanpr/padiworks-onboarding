import Image from "next/image";

/** Shared decorative primitives reused across the different side-panel collage variants. */

export function CroppedImg({
  src,
  width,
  height,
  left,
  top,
}: {
  src: string;
  width: string;
  height: string;
  left: string;
  top: string;
}) {
  return (
    <img
      src={src}
      alt=""
      className="pointer-events-none absolute max-w-none object-cover"
      style={{ width, height, left, top }}
    />
  );
}

export function MockupCard({
  className,
  rounded = "rounded-[5%]",
  innerClassName = "top-[6px] right-[4px] bottom-[6px] left-[4px]",
  crop,
}: {
  className?: string;
  rounded?: string;
  innerClassName?: string;
  crop: { src: string; width: string; height: string; left: string; top: string };
}) {
  return (
    <div
      className={`absolute border border-white bg-white/40 shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)] ${rounded} ${className ?? ""}`}
    >
      <div className={`absolute overflow-hidden rounded-[4.5%] ${innerClassName}`}>
        <CroppedImg {...crop} />
      </div>
    </div>
  );
}

export function AvatarBubble({
  className,
  src,
  size = "w-[9.72%]",
}: {
  className?: string;
  src: string;
  size?: string;
}) {
  return (
    <div
      className={`absolute aspect-square overflow-hidden rounded-full border-4 border-white shadow-[0_16px_24px_0_rgba(16,25,40,0.24),0_4px_6px_0_rgba(16,25,40,0.12)] ${size} ${className ?? ""}`}
    >
      <Image src={src} alt="" fill className="object-cover" />
    </div>
  );
}

export function PointerArrow({
  className,
  src,
  rotate,
  flip = true,
}: {
  className?: string;
  src: string;
  rotate: string;
  flip?: boolean;
}) {
  const fill = src.includes("arrow-a")
    ? "#FACC15"
    : src.includes("arrow-b")
      ? "#14B8A6"
      : "#3B82F6";

  return (
    <div
      className={`absolute ${className ?? ""}`}
      style={{ transform: `${flip ? "scaleY(-1) " : ""}rotate(${rotate})` }}
    >
      <svg viewBox="21 2 45 45" className="size-full overflow-visible drop-shadow-[0_5px_5px_rgba(5,8,21,0.28)]" aria-hidden="true">
        <path d="M51.5615 9.13298L28.0077 15.1647C24.0137 16.1875 23.9914 21.8526 27.9773 22.9067L33.8109 24.4495C35.3781 24.864 36.5401 26.1833 36.7534 27.7902L37.631 34.4016C38.1444 38.2687 43.3241 39.1887 45.1377 35.7349L56.0953 14.8676C57.7066 11.7991 54.919 8.2732 51.5615 9.13298Z" fill={fill} stroke="#050815" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function GlassPanel({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-[3.2%] border border-white/30 bg-white/10 blur-[3px] ${className ?? ""}`}
    />
  );
}

export function PillBadge({
  className,
  children,
  blurred = false,
}: {
  className?: string;
  children: React.ReactNode;
  blurred?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-full border border-white/30 bg-white/20 p-1 ${blurred ? "blur-[2px]" : ""} ${className ?? ""}`}
    >
      <div className="rounded-full bg-white px-4 py-3 text-sm font-semibold whitespace-nowrap text-brand-grey-700 shadow-sm">
        {children}
      </div>
    </div>
  );
}
