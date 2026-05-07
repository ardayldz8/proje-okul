import type { ReactNode } from "react";

import { requireStudentSession } from "@/lib/student-session";

export default async function StudentPanelLayout({ children }: { children: ReactNode }) {
  await requireStudentSession();

  return children;
}
