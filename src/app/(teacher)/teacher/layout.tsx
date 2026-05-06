import { TeacherPanelShell } from "@/components/teacher-panel-shell";

export default function TeacherLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <TeacherPanelShell>{children}</TeacherPanelShell>;
}
