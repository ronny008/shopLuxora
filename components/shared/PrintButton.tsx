"use client";

import React from 'react';

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      Print Invoice
    </button>
  );
}
