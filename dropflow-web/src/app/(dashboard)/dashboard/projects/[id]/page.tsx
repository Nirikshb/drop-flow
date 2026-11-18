import { ProjectSettings } from "@/components/dashboard/project-settings";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectSettings projectId={id} />;
}
