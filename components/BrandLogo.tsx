import Image from "next/image";
import logo from "@/assets/brand/vritta-logo.svg";

/** Official Vritta logo (mark + wordmark, no tagline). Set the height via className. */
export function BrandLogo({ className = "h-8 w-auto", alt = "Vritta" }: { className?: string; alt?: string }) {
  return <Image src={logo} alt={alt} priority className={className} />;
}
