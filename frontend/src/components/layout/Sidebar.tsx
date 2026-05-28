"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Sparkles,
  Library,
  Settings,
  Plus,
} from "lucide-react";
import clsx from "clsx";
import { schoolName, schoolLocation } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Library },
];

interface SidebarProps {
  assignmentCount?: number;
  variant?: "default" | "home";
}

export function Sidebar({
  assignmentCount = 0,
  variant = "default",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 z-30">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-red-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">V</span>
        </div>
        <span className="font-semibold text-lg">VedaAI</span>
      </div>

      <div className="px-4 mb-4">
        {variant === "home" ? (
          <Link
            href="/toolkit"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-orange/30 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4 text-brand-orange relative z-10" />
            <span className="relative z-10">AI Teacher&apos;s Toolkit</span>
          </Link>
        ) : (
          <Link
            href="/assignments/create"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-brand-green" />
            Create Assignment
          </Link>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/assignments"
                ? pathname.startsWith("/assignments")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const badge =
            item.label === "Assignments" && assignmentCount > 0
              ? assignmentCount
              : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="bg-brand-orange text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            pathname === "/settings" || pathname.startsWith("/settings/")
              ? "bg-gray-100 font-medium text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {schoolName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{schoolName}</p>
            {schoolLocation ? (
              <p className="text-xs text-gray-500 truncate">{schoolLocation}</p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
