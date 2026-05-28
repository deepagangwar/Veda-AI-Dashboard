"use client";

import { NavPage } from "@/components/layout/NavPage";

export default function GroupsPage() {
  return (
    <NavPage
      title="My Groups"
      heading="My Groups"
      description="Class groups will be listed here."
      actionLabel="Assignments"
      actionHref="/assignments"
    />
  );
}
