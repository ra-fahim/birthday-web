import AuthExperience from '@/components/auth/AuthExperience';

export const metadata = { title: 'Log in — Wishly', robots: { index: false, follow: false } };

export default function Login() {
  return <AuthExperience mode="login" />;
}
