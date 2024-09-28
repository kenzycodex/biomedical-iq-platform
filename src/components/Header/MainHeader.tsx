import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MainModeSwitcher from "./MainModeSwitcher";
import { ChevronLeft } from 'lucide-react';

const MainHeader = () => {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex items-center justify-between w-full px-4 py-4 md:px-6 2xl:px-11">
        {/* Logo and Brand Name */}
        <Link className="flex items-center gap-2" href="/">
          <Image
            width={32}
            height={32}
            src={"/images/logo/logo-icon.png"}
            alt="Logo"
          />
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            Biomedical IQ
          </span>
        </Link>
        
        {/* Navigation Links, Go Back Button, and Dark Mode Toggler */}
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/about" className="text-gray-800 dark:text-white hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-gray-800 dark:text-white hover:underline">
              Contact
            </Link>
          </nav>
          
          {/* Go Back Button (visible on all screen sizes) */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-800 dark:text-white hover:underline"
            aria-label="Go back"
          >
            <ChevronLeft
  className="w-5 h-5 mr-1"
  style={{ fontWeight: 'bold', strokeWidth: 5 }} 
/>
            <span className="hidden sm:inline">Go Back</span>
          </button>
          
          <MainModeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;