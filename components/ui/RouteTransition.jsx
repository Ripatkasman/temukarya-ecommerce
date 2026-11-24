"use client";

import { usePathname } from "next/navigation";

export default function RouteTransition({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-route-enter">
      {children}
    </div>
  );
}