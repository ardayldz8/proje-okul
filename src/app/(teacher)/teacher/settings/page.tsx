import { requireTeacher } from "@/lib/authorization";
import { TeacherPanelFrame } from "@/components/teacher-panel-frame";
import { SettingsClient } from "./_components/settings-client";

export const dynamic = "force-dynamic";

export default async function TeacherSettingsPage() {
  const session = await requireTeacher();
  const teacherName = session.user.name ?? "Koç";

  return (
    <TeacherPanelFrame activeHref="/teacher/settings" teacherName={teacherName}>
      <SettingsClient profile={{ fullName: teacherName, email: session.user.email ?? "" }} />
    </TeacherPanelFrame>
  );
}
