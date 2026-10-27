import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  onToggleMode,
}) {
  return (
    <AuthLayout>
      <AuthForm
        isRegister={false}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onToggleMode={onToggleMode}
      />
    </AuthLayout>
  );
}
