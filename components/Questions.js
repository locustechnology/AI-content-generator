import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-lg ${isOpen ? 'text-indigo-600 font-semibold' : 'text-gray-800'}`}>
          {question}
        </span>
        {isOpen ? (
          <Minus className="text-indigo-600 h-5 w-5" />
        ) : (
          <Plus className="text-indigo-600 h-5 w-5" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600">
          {answer}
        </p>
      )}
    </div>
  );
};

const Questions = () => {
  const faqData = [
    {
      question: "Can I use my photos anywhere?",
      answer: "Yes! You own your new photos, use them as you please! Our full commercial license grants you complete ownership, allowing you to showcase your pictures on your social media, website, business cards, and beyond!"
    },
    {
      question: "What images should I upload for the best results?",
      answer: "For optimal results, upload clear, well-lit photos of yourself facing the camera. Avoid group shots or images with busy backgrounds. The more variety in your uploads, the better the AI can understand your features."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We take data security very seriously. All uploaded images and personal information are encrypted and securely stored. We never share your data with third parties and delete your original photos after processing."
    },
    {
      question: "Can I request a refund for my purchase?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service, please contact our support team for a full refund."
    },
    {
      question: "Which image file types can I upload?",
      answer: "We accept most common image formats including JPEG, PNG, and HEIF. The maximum file size is 20MB per image."
    },
    {
      question: "Is it possible to request Manual Edits for my headshot photos?",
      answer: "Yes, we offer manual editing services for an additional fee. This service includes retouching and specific customizations not covered by our AI process."
    },
    {
      question: "Can I request a Redo for my headshot order?",
      answer: "Certainly! If you're not completely satisfied with your initial results, you can request a redo. We'll guide you through improving your input photos or adjusting AI settings for better outcomes."
    },
    {
      question: "Who owns the pictures?",
      answer: "You do! Once we deliver your AI-generated headshots, you have full ownership and usage rights."
    },
    {
      question: "Do the headshots look real enough to use?",
      answer: "Yes, our AI-generated headshots are designed to look professional and natural. Many of our customers use them for LinkedIn, company websites, and other professional platforms without issue."
    },
    {
      question: "Will my payment information be safe?",
      answer: "Absolutely. We use industry-standard encryption and secure payment processors to ensure your financial information is always protected."
    },
    {
      question: "Where do I seek support? I need more help.",
      answer: "Our customer support team is available 24/7. You can reach us through the chat feature on our website, by email at support@aiheadshots.com, or by phone at 1-800-AI-PHOTO."
    }
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;