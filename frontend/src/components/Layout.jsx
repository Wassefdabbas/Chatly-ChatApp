import { useState } from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar (always visible on large screens) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar (conditional) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative z-50 w-64 h-full bg-base-200 shadow-xl">
              <Sidebar onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;