import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  { name: "Caleb Wright", comment: "These AI headshots are next level.", rating: 5 },
  { name: "Luke Anderson", comment: "Blown away. The future of photography is here.", rating: 5 },
  { name: "Andrew Robins", comment: "Effective, fast, and easy. Great service!", rating: 5 },
  { name: "Owen Harris", comment: "Professional photos in minutes. Amazing!", rating: 5 },
  { name: "Cherry Cho", comment: "GoStudio.ai is now my go-to for professional photos.", rating: 5 },
  { name: "Amalia Müller", comment: "Very satisfied with the quick service and quality.", rating: 5 },
  { name: "Hannah Lee", comment: "Quick, easy, and surprisingly professional.", rating: 5 },
];

const logos = [
  { name: "Dell", src: "/api/placeholder/120/40" },
  { name: "Shopify", src: "/api/placeholder/120/40" },
  { name: "eBay", src: "/api/placeholder/120/40" },
  { name: "Stack Overflow", src: "/api/placeholder/120/40" },
  { name: "Box", src: "/api/placeholder/120/40" },
  { name: "Berkeley", src: "/api/placeholder/120/40" },
];

const ReviewPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="flex flex-col sm:flex-row justify-between w-full max-w-3xl">
            <div className="text-center mb-4 sm:mb-0">
              <h2 className="text-5xl sm:text-6xl font-bold text-blue-500 mb-2">86000</h2>
              <p className="text-lg sm:text-xl font-semibold">AI Headshots created</p>
            </div>
            <div className="text-center">
              <h2 className="text-5xl sm:text-6xl font-bold text-blue-500 mb-2">2100</h2>
              <p className="text-lg sm:text-xl font-semibold">Happy Customers Globally</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 bg-gray-50 py-6 rounded-lg">
          {logos.map((logo) => (
            <img key={logo.name} src={logo.src} alt={logo.name} className="h-6 sm:h-8" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3 sm:p-4 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">AI Summary</h3>
              <p className="text-xs sm:text-sm mb-3">Customers praise the product's convenience, price and ease of use, especially for selecting styles and AI Feedback on uploading images.</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold">112</span>
              </div>
              <p className="text-xs mt-1">based on 112 written reviews</p>
            </div>
          </div>
          
          {reviews.slice(0, 7).map((review) => (
            <div key={review.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img src={`/api/placeholder/400/200`} alt={review.name} className="w-full h-28 object-cover" />
                <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
                  <img src="/api/placeholder/24/24" alt="GoStudio.ai" className="w-4 h-4" />
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-xs sm:text-sm">{review.name}</h3>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export default ReviewPage;