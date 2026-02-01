import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Main content area with responsive padding */}
          <div className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50/50 to-blue-50/30 backdrop-blur-sm pt-16 lg:pt-16">
            {/* REMOVED max-w-7xl to allow full width */}
            <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-8">
              {/* Increased max width and added responsive widths */}
              <div className="max-w-none lg:max-w-[99%] xl:max-w-[98%] 2xl:max-w-[97%] mx-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;