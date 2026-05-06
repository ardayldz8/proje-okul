import { StudentPanelShell } from "@/components/student-panel-shell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentPanelShell>{children}</StudentPanelShell>;
}
