"use client";

import { useState } from 'react';
import { Star, X } from 'lucide-react';

export function ReviewSection() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your review!");
    setShowReviewForm(false);
    // reset form
    setName('');
    setTitle('');
    setReview('');
    setRating(5);
  };

  return (
    <div className="container mx-auto px-4 py-16 border-t border-gray-100 text-center">
      <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-8">Customer Reviews</h2>
      <div className="flex flex-col items-center justify-center mb-6">
         <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-[#0E6334] text-[#0E6334]" />)}
         </div>
         <p className="text-xs font-bold text-black uppercase tracking-wider">Based on 5 reviews</p>
      </div>
      <button 
        onClick={() => setShowReviewForm(true)}
        className="bg-[#0E6334] text-white text-[10px] font-bold uppercase tracking-wider px-6 py-3 hover:bg-[#0a4b27] transition-colors"
      >
        Write a Review
      </button>

      {/* Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-left">
          <div className="bg-white p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto rounded-none">
            <button onClick={() => setShowReviewForm(false)} className="absolute top-4 right-4 text-black hover:text-black/70">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-black">Write a Review</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-black mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setRating(i)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${i <= rating ? 'fill-[#0E6334] text-[#0E6334]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-bold tracking-wider uppercase text-black mb-2">Name</label>
                <input required type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" placeholder="Enter your name" />
              </div>

              <div>
                <label htmlFor="title" className="block text-xs font-bold tracking-wider uppercase text-black mb-2">Review Title</label>
                <input required type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" placeholder="Give your review a title" />
              </div>

              <div>
                <label htmlFor="review" className="block text-xs font-bold tracking-wider uppercase text-black mb-2">Review</label>
                <textarea required id="review" rows={4} value={review} onChange={(e) => setReview(e.target.value)} className="block w-full border border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-0 rounded-none" placeholder="Write your comments here"></textarea>
              </div>

              <button type="submit" className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-wider px-6 py-3 hover:bg-black/80 transition-colors mt-4">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
