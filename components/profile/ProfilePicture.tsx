import Image from "next/image";

export function ProfilePicture({ src, alt }: { src?: string | null; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={120}
        height={120}
        className="h-28 w-28 rounded-[2rem] border border-white/10 object-cover"
      />
    );
  }

  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-coral/30 to-mint/20 text-3xl font-semibold text-white">
      {alt.charAt(0).toUpperCase()}
    </div>
  );
}
