import { requireUser } from "@/lib/auth";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const user = await requireUser();

  return <SettingsForm user={{ name: user.name, email: user.email }} />;
}
