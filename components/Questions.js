'use client'
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => (
  <div className={`mb-4 overflow-hidden rounded-lg shadow-md ${isOpen ? 'bg-white' : 'bg-gray-100'}`}>
    <button
      className="flex justify-between items-center w-full text-left p-4"
      onClick={toggleOpen}
    >
      <span className={`text-lg ${isOpen ? 'text-indigo-600' : 'text-gray-900'}`}>{question}</span>
      <div className={`${isOpen ? 'bg-black' : 'bg-indigo-600'} rounded-full p-1`}>
        {isOpen ? (
          <Minus className="h-5 w-5 text-white" />
        ) : (
          <Plus className="h-5 w-5 text-white" />
        )}
      </div>
    </button>
    {isOpen && (
      <div className="px-4 pb-4">
        <p className="text-gray-600">{answer}</p>
      </div>
    )}
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Can I use my photos anywhere?",
      answer: "Yes! You own your new photos, use them as you please! Our full commercial license grants you complete ownership, allowing you to showcase your pictures on your social media, website, business cards, and beyond!"
    },
    {
      question: "What images should I upload for the best results?",
      answer: "For best results, upload clear, well-lit photos of yourself facing the camera directly. Avoid group shots or images with busy backgrounds."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All your information is encrypted and stored securely. We never share your personal data with third parties."
    },
    {
      question: "Can I request a refund for my purchase?",
      answer: "We offer refunds within 30 days of purchase if you're not satisfied with our service. Please contact our support team for assistance."
    },
    {
      question: "Which image file types can I upload?",
      answer: "We accept most common image formats including JPEG, PNG, and HEIF. The maximum file size is 10MB per image."
    },
    {
      question: "Is it possible to request Manual Edits for my headshot photos?",
      answer: "Yes, we offer manual editing services for an additional fee. You can request this option during the checkout process."
    },
    {
      question: "Can I request a Redo for my headshot order?",
      answer: "Absolutely! If you're not satisfied with your initial results, you can request a redo within 14 days of receiving your photos."
    },
    {
      question: "Who owns the pictures?",
      answer: "You do! Once you receive your photos, you have full ownership and usage rights for them."
    },
    {
      question: "Do the headshots look real enough to use?",
      answer: "Yes, our AI-generated headshots are designed to look professional and natural. Many of our customers use them for professional profiles and marketing materials."
    },
    {
      question: "Will my payment information be safe?",
      answer: "Absolutely. We use industry-standard encryption and secure payment processors to ensure your financial information is protected."
    },
    {
      question: "Where do I seek support? I need more help.",
      answer: "You can reach our customer support team through the 'Contact Us' page on our website, or by emailing support@ourcompany.com. We're here to help!"
    }
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-[2rem]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              toggleOpen={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;