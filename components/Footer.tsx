import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "/public/98.png";

interface FooterItem {
  name?: string;
  flag?: string;
}

interface FooterSectionProps {
  title: string;
  items: (string | FooterItem)[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, items }) => (
  <div className="mb-8">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={typeof item === 'string' ? item : item.name || index}>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            {typeof item === 'string' ? item : item.name} {typeof item !== 'string' && item.flag && <span>{item.flag}</span>}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const sections: FooterSectionProps[] = [
    {
      title: 'Use Cases',
      items: ['Real Estate Headshots', 'Lawyer Headshots', 'Doctor Headshots', 'Resume Headshots', 'LinkedIn Headshots']
    },
    {
      title: 'Resources',
      items: ['Blog', 'Headshot Studios Near Me', 'Types of Headshots', 'Support', 'Pricing']
    },
    {
      title: 'City Headshots',
      items: [
        { name: 'Headshots Sydney', flag: '🇦🇺' },
        { name: 'Headshots Toronto', flag: '🇨🇦' },
        { name: 'Headshots NYC', flag: '🇺🇸' },
        { name: 'Headshots LA', flag: '🇺🇸' },
        { name: 'Headshots Chicago', flag: '🇺🇸' }
      ]
    }
  ];

  const bottomSections: FooterSectionProps[] = [
    { title: 'Features', items: ['AI Headshot Generator', 'AI Studio', 'For Teams'] },
    { title: 'Company', items: ['About Us', 'Contact Us', 'Partners'] },
    { title: 'Legal', items: ['Terms & Conditions', 'Refund Policy', 'Privacy Policy'] }
  ];

  return (
    <footer className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center mb-4">
              <Image src={logo} alt="Studio.ai logo" width={20} height={20} className="rounded-sm" />
              <span className="text-xl font-bold">Studio.ai</span>
            </Link>
            <p className="text-sm text-gray-600 mb-2">
              Professional AI Headshots for individuals and remote teams, in 4K quality.
            </p>
            <p className="text-sm text-gray-600">
              Get your headshot in under 60 minutes, no photographer needed. Starting from $35.
            </p>
          </div>
          <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <div className="grid grid-cols-3 gap-8">
            {bottomSections.map((section) => (
              <FooterSection key={section.title} {...section} />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Copyright© 2024 <Link href="/" className="text-blue-500 hover:text-blue-600">Gostudio.ai</Link>
          </p>
          <p className="text-sm text-gray-600 mt-4 md:mt-0">
            Need help? <Link href="/" className="text-[#5B16FE] hover:text-blue-600">Contact Us</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;