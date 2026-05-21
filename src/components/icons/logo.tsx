import * as React from "react";
import Image from "next/image";
import logoImage from "../../../public/icon/logo.png"; 

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={logoImage}
        alt="EvoHR Logo"
        fill 
        sizes="(max-width: 768px) 100vw, 192px"
        className="object-contain" 
        priority 
      />
    </div>
  );
}