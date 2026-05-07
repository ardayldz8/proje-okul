import { notFound } from "next/navigation";

import { StudentDashboardClient } from "@/app/(student)/student/dashboard/dashboard-client";
import { getStudentDashboardData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function StudentDashboardPage() {
  const sessionStudent = await requireStudentSession();
  const dashboardData = await getStudentDashboardData(sessionStudent.id);

  if (!dashboardData.student) {
    notFound();
  }

  return <StudentDashboardClient {...dashboardData} student={dashboardData.student} />;
}
