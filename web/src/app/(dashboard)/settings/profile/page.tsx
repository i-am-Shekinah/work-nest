import { PageHeader } from "@/components/layout/page-header";
import { ProfileForms } from "@/features/auth/forms";
import { serverApiFetch } from "@/lib/api/server";
import type { AuthenticatedUser } from "@/lib/api/generated/contracts";

export default async function ProfilePage() {
  const profile = await serverApiFetch<AuthenticatedUser>("me");

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Profile and password"
        description="Manage the current user profile returned by the backend `/me` resource."
      />
      <ProfileForms currentProfilePictureUrl={profile.profilePictureUrl} />
    </>
  );
}
