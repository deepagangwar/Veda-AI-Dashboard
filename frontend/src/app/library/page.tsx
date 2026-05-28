"use client";

import { NavPage } from "@/components/layout/NavPage";

export default function LibraryPage() {
  return (
    <NavPage
      title="My Library"
      heading="My Library"
      description="Saved papers and uploads."
      actionLabel="Assignments"
      actionHref="/assignments"
    />
  );
}
