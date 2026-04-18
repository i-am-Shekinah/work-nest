"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { clientApiFetch } from "@/lib/api/client";

function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#082f49_0%,#0f172a_48%,#f8fafc_48%,#f8fafc_100%)] px-4 py-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">WorkNest</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Operations, bookings, and people management in one place.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300">
              A streamlined booking system for managing services, schedules, and users efficiently through a clean and intuitive interface.
          </p>
        </div>
        <Card className="mx-auto w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}

function useAsyncState() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return {
    error,
    success,
    loading,
    start() {
      setLoading(true);
      setError(null);
      setSuccess(null);
    },
    fail(message: string) {
      setLoading(false);
      setError(message);
    },
    done(message?: string) {
      setLoading(false);
      if (message) {
        setSuccess(message);
      }
    },
  };
}

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export function LoginForm() {
  const router = useRouter();
  const state = useAsyncState();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthShell title="Sign in" description="Authenticate through the Next session boundary.">
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          state.start();
          try {
            await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }).then(async (response) => {
              const payload = await response.json();
              if (!response.ok) {
                throw new Error(payload.message ?? "Unable to sign in.");
              }
            });

            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            state.fail(error instanceof Error ? error.message : "Unable to sign in.");
          }
        })}
      >
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormField>
        <FormField label="Password" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register("password")} />
        </FormField>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <Button type="submit" disabled={state.loading}>
          {state.loading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="flex justify-between text-sm text-slate-500">
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href="/register">Accept invitation</Link>
        </div>
      </form>
    </AuthShell>
  );
}

const forgotPasswordSchema = z.object({
  email: z.email(),
});

export function ForgotPasswordForm() {
  const state = useAsyncState();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <AuthShell title="Forgot password" description="Request a password reset link.">
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          state.start();
          try {
            const payload = await clientApiFetch<{ message: string }>("auth/forgot-password", {
              method: "POST",
              body: values,
            });
            state.done(payload.message);
          } catch (error) {
            state.fail(error instanceof Error ? error.message : "Request failed.");
          }
        })}
      >
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormField>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        <Button type="submit" disabled={state.loading}>
          {state.loading ? "Sending..." : "Send reset link"}
        </Button>
        <Link href="/login" className="text-sm text-slate-500">
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const state = useAsyncState();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token ?? "", password: "" },
  });

  return (
    <AuthShell title="Reset password" description="Submit the reset token and your new password.">
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          state.start();
          try {
            const payload = await clientApiFetch<{ message: string }>("auth/reset-password", {
              method: "POST",
              body: values,
            });
            state.done(payload.message);
            setTimeout(() => router.push("/login"), 800);
          } catch (error) {
            state.fail(error instanceof Error ? error.message : "Request failed.");
          }
        })}
      >
        <FormField label="Reset token" error={form.formState.errors.token?.message}>
          <Input {...form.register("token")} />
        </FormField>
        <FormField label="New password" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register("password")} />
        </FormField>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        <Button type="submit" disabled={state.loading}>
          {state.loading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthShell>
  );
}

const acceptInviteSchema = z.object({
  token: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePictureUrl: z.string().url().optional().or(z.literal("")),
  password: z.string().min(8),
});

export function AcceptInviteForm({ token }: { token?: string }) {
  const router = useRouter();
  const state = useAsyncState();
  const form = useForm<z.infer<typeof acceptInviteSchema>>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: token ?? "",
      firstName: "",
      lastName: "",
      profilePictureUrl: "",
      password: "",
    },
  });

  return (
    <AuthShell title="Accept invitation" description="Complete your account setup and sign in.">
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          state.start();
          try {
            await clientApiFetch<{ token: string }>("invitation/accept-invite", {
              method: "POST",
              body: {
                ...values,
                profilePictureUrl: values.profilePictureUrl || undefined,
              },
            });
            state.done("Invitation accepted. You can sign in now.");
            setTimeout(() => router.push("/login"), 800);
          } catch (error) {
            state.fail(error instanceof Error ? error.message : "Request failed.");
          }
        })}
      >
        <FormField label="Invitation token" error={form.formState.errors.token?.message}>
          <Input {...form.register("token")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" error={form.formState.errors.firstName?.message}>
            <Input {...form.register("firstName")} />
          </FormField>
          <FormField label="Last name" error={form.formState.errors.lastName?.message}>
            <Input {...form.register("lastName")} />
          </FormField>
        </div>
        <FormField
          label="Profile picture URL"
          error={form.formState.errors.profilePictureUrl?.message}
        >
          <Input {...form.register("profilePictureUrl")} />
        </FormField>
        <FormField label="Password" error={form.formState.errors.password?.message}>
          <Input type="password" {...form.register("password")} />
        </FormField>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        <Button type="submit" disabled={state.loading}>
          {state.loading ? "Submitting..." : "Activate account"}
        </Button>
      </form>
    </AuthShell>
  );
}

const profileSchema = z.object({
  profilePictureUrl: z.string().url(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function ProfileForms({
  currentProfilePictureUrl,
}: {
  currentProfilePictureUrl?: string;
}) {
  const router = useRouter();
  const profileState = useAsyncState();
  const passwordState = useAsyncState();
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profilePictureUrl:
        currentProfilePictureUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Profile picture</h2>
        <form
          className="mt-4 grid gap-4"
          onSubmit={profileForm.handleSubmit(async (values) => {
            profileState.start();
            try {
              await clientApiFetch("me/update-profile-picture", {
                method: "PATCH",
                body: values,
              });
              profileState.done("Profile updated.");
              router.refresh();
            } catch (error) {
              profileState.fail(error instanceof Error ? error.message : "Unable to update profile.");
            }
          })}
        >
          <FormField
            label="Profile picture URL"
            error={profileForm.formState.errors.profilePictureUrl?.message}
          >
            <Input {...profileForm.register("profilePictureUrl")} />
          </FormField>
          {profileState.error ? <p className="text-sm text-red-600">{profileState.error}</p> : null}
          {profileState.success ? <p className="text-sm text-emerald-700">{profileState.success}</p> : null}
          <Button type="submit" disabled={profileState.loading}>
            Save profile
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Change password</h2>
        <form
          className="mt-4 grid gap-4"
          onSubmit={passwordForm.handleSubmit(async (values) => {
            passwordState.start();
            try {
              await clientApiFetch("me/change-password", {
                method: "PATCH",
                body: {
                  oldPassword: values.oldPassword,
                  newPassword: values.newPassword,
                },
              });
              passwordState.done("Password updated.");
              passwordForm.reset();
            } catch (error) {
              passwordState.fail(error instanceof Error ? error.message : "Unable to update password.");
            }
          })}
        >
          <FormField label="Current password" error={passwordForm.formState.errors.oldPassword?.message}>
            <Input type="password" {...passwordForm.register("oldPassword")} />
          </FormField>
          <FormField label="New password" error={passwordForm.formState.errors.newPassword?.message}>
            <Input type="password" {...passwordForm.register("newPassword")} />
          </FormField>
          <FormField
            label="Confirm new password"
            error={passwordForm.formState.errors.confirmPassword?.message}
          >
            <Input type="password" {...passwordForm.register("confirmPassword")} />
          </FormField>
          {passwordState.error ? <p className="text-sm text-red-600">{passwordState.error}</p> : null}
          {passwordState.success ? <p className="text-sm text-emerald-700">{passwordState.success}</p> : null}
          <Button type="submit" disabled={passwordState.loading}>
            Change password
          </Button>
        </form>
      </Card>
    </div>
  );
}

const inviteUserSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["ADMIN", "STAFF"]),
  departmentId: z.string().min(1),
});

export function InviteUserForm({
  departments,
}: {
  departments: { id: string; name: string }[];
}) {
  const state = useAsyncState();
  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "STAFF",
      departmentId: departments[0]?.id ?? "",
    },
  });

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-900">Invite user</h2>
      <form
        className="mt-4 grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          state.start();
          try {
            const payload = await clientApiFetch<{ user: unknown }>("invitation/invite-user", {
              method: "POST",
              body: values,
            });
            if (payload.user) {
              state.done("Invitation sent.");
              form.reset({
                email: "",
                firstName: "",
                lastName: "",
                role: "STAFF",
                departmentId: departments[0]?.id ?? "",
              });
            }
          } catch (error) {
            state.fail(error instanceof Error ? error.message : "Unable to invite user.");
          }
        })}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" error={form.formState.errors.firstName?.message}>
            <Input {...form.register("firstName")} />
          </FormField>
          <FormField label="Last name" error={form.formState.errors.lastName?.message}>
            <Input {...form.register("lastName")} />
          </FormField>
        </div>
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Role" error={form.formState.errors.role?.message}>
            <Select {...form.register("role")}>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </Select>
          </FormField>
          <FormField label="Department" error={form.formState.errors.departmentId?.message}>
            <Select {...form.register("departmentId")}>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        <Button type="submit" disabled={state.loading}>
          Send invitation
        </Button>
      </form>
    </Card>
  );
}

export function NotesEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return <Textarea value={value} onChange={(event) => onChange(event.target.value)} />;
}
