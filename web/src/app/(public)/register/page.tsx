import { AcceptInviteForm } from "@/features/auth/forms";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <AcceptInviteForm token={params.token} />;
}
