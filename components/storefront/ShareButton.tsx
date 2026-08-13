"use client";

import { Share } from 'lucide-react';
import { useState } from 'react';

export function ShareButton({ title, url }: { title: string, url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const fullUrl = `${window.location.origin}${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: fullUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-black hover:text-black/70 transition-colors focus:outline-none"
    >
      <Share className="w-3 h-3" /> {copied ? 'Copied Link!' : 'Share'}
    </button>
  );
}
