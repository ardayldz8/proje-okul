import { redirect } from "next/navigation";

import { clearStudentSession } from "@/lib/student-session";

export default async function StudentLogoutPage() {
  await clearStudentSession();
  redirect("/");
}
