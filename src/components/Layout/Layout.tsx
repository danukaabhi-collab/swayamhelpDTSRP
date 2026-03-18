import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AIAssistant from '../AIAssistant/AIAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
