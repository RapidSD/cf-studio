import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md p-8 mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Welcome!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to sign in
        </p>
        <LoginForm />
      </div>
    </div>
  );
} 