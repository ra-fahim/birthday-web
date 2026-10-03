import AuthExperience from '@/components/auth/AuthExperience';

export const metadata = { title: 'Log in — Wishes', robots: { index: false, follow: false } };

export default function Login() {
  return <AuthExperience mode="login" />;
}
