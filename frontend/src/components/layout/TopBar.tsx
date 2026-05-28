"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, Menu } from "lucide-react";
import { userName } from "@/lib/constants";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showCreateNew?: boolean;
  onMenuClick?: () => void;
}

export function TopBar({
  title = "Assignments",
  showBack = false,
  showCreateNew = false,
  onMenuClick,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-orange to-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-semibold">VedaAI</span>
          </div>
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {showCreateNew ? (
            <Link
              href="/assignments/create"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="text-base leading-none">+</span>
              Create New
            </Link>
          ) : (
            <>
              <h1 className="hidden lg:block text-lg font-medium">{title}</h1>
              <h1 className="lg:hidden text-base font-medium ml-1">{title}</h1>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
          </button>
          <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium">{userName}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
