"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Library, Sparkles } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/library", label: "Library", icon: Library },
  { href: "/toolkit", label: "AI Toolkit", icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-brand-dark text-gray-400 z-40 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/assignments"
                ? pathname.startsWith("/assignments")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs",
                isActive ? "text-white" : "hover:text-gray-200"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
