import { Metadata } from 'next';
import { CompareClient } from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Products - Luxora',
  description: 'Compare products side-by-side to find the perfect item.',
};

export default function ComparePage() {
  return (
    <div className="bg-white min-h-[60vh]">
      <CompareClient />
    </div>
  );
}
