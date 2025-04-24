import { Suspense } from 'react';
import VerifyForm from '../../components/VerifyForm';

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">Verify Your Email</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
} 