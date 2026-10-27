import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/input";

export default function RegisterPage({
  email,
  setEmail,
  password,
  setPassword,
  onToggleMode,
}) {
  return (
    <AuthLayout>
      <AuthForm
        isRegister={true}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onToggleMode={onToggleMode}
      >
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            placeholder="your_username"
            required
            minLength={3}
            maxLength={30}
            className="h-12 rounded-md border-[#DCD7CC] bg-transparent px-4 shadow-none focus-visible:ring-[#777A62]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            Display name
          </label>
          <Input
            id="displayName"
            name="displayName"
            autoComplete="name"
            placeholder="How people know you"
            required
            maxLength={50}
            className="h-12 rounded-md border-[#DCD7CC] bg-transparent px-4 shadow-none focus-visible:ring-[#777A62]"
          />
        </div>
      </AuthForm>
    </AuthLayout>
  );
}
