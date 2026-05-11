'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/src/actions/auth.actions';
// Import your UI components (e.g., Button, Input) from '@/components/ui/...'

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function clientAction(formData: FormData) {
    setIsPending(true);
    setError(null);
    
    const result = await signupAction(formData);
    
    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    // On success, redirect to the new dashboard
    router.push('/dashboard'); 
  }

  return (
    <form action={clientAction} className="space-y-6 max-w-md w-full">
      {error && <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm">{error}</div>}

      <div className="space-y-4">
        {/* Company Details */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-black">Company Name</label>
          <input type="text" id="companyName" name="companyName" required className="mt-1 block w-full border rounded-md p-2" />
        </div>
        
        <div>
          <label htmlFor="departments" className="block text-sm font-medium text-black">Departments (Comma separated)</label>
          <input type="text" id="departments" name="departments" placeholder="HR, IT, Finance, Sales" required className="mt-1 block w-full border rounded-md p-2" />
          <p className="text-xs text-gray-500 mt-1">Example: Engineering, Marketing, Operations</p>
        </div>

        <hr className="my-4" />

        {/* User Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-black">First Name</label>
            <input type="text" id="firstName" name="firstName" required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-black">Last Name</label>
            <input type="text" id="lastName" name="lastName" required className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black">Work Email</label>
          <input type="email" id="email" name="email" required className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
          <input type="password" id="password" name="password" required minLength={8} className="mt-1 block w-full border rounded-md p-2" />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Creating Workspace...' : 'Create Workspace & Account'}
      </button>
    </form>
  );
}