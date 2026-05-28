"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import Link from "next/link";
import { Plus } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showCreateNew?: boolean;
  assignmentCount?: number;
  showFab?: boolean;
  sidebarVariant?: "default" | "home";
}

export function DashboardLayout({
  children,
  title,
  showBack,
  showCreateNew,
  assignmentCount,
  showFab = true,
  sidebarVariant = "default",
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar assignmentCount={assignmentCount} variant={sidebarVariant} />

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopBar
          title={title}
          showBack={showBack}
          showCreateNew={showCreateNew}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 pb-20 lg:pb-8">{children}</main>
      </div>

      <MobileNav />

      {showFab && (
        <Link
          href="/assignments/create"
          className="lg:hidden fixed bottom-20 right-4 w-12 h-12 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-orange-600 transition-colors"
          aria-label="Create assignment"
        >
          <Plus className="w-6 h-6" />
        </Link>
      )}
    </div>
  );
}
