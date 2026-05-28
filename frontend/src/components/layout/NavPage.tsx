"use client";

import Link from "next/link";
import { DashboardLayout } from "./DashboardLayout";

interface NavPageProps {
  title: string;
  heading: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function NavPage({
  title,
  heading,
  description,
  actionLabel,
  actionHref,
}: NavPageProps) {
  return (
    <DashboardLayout title={title} showFab={false}>
      <div className="px-4 lg:px-8 py-12 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">{heading}</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{description}</p>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </DashboardLayout>
  );
}
