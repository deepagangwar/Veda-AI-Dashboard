"use client";

import { NavPage } from "@/components/layout/NavPage";

export default function ToolkitPage() {
  return (
    <NavPage
      title="AI Teacher's Toolkit"
      heading="AI Teacher's Toolkit"
      description="Teaching tools and generators."
      actionLabel="New assignment"
      actionHref="/assignments/create"
    />
  );
}
