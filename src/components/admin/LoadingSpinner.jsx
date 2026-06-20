'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="admin-loading">
      <Loader2 size={32} className="spin" />
      <p>{text}</p>
    </div>
  );
}
