import React from 'react';
import { Button } from '@hommiespace/ui';
import { useNavigate } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-linen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <h1 className="font-serif text-3xl font-bold text-brand-walnut mb-2">Access Denied</h1>
        <p className="text-brand-clay text-xs uppercase tracking-widest font-semibold mb-6">403 - Forbidden</p>
        <p className="text-brand-clay text-sm mb-6 leading-relaxed">
          Your account role does not have permission to access this page. Please contact administration if you believe this is an error.
        </p>
        <Button variant="primary" onClick={() => navigate('/login')}>Back to Log In</Button>
      </div>
    </div>
  );
};
export default Unauthorized;
