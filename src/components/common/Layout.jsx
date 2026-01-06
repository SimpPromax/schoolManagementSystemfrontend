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
          {/* Main content area with top padding for both mobile and desktop */}
          <div className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50/50 to-blue-50/30 backdrop-blur-sm pt-16 lg:pt-16">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;