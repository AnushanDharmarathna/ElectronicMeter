import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

//Superadmin
import HomePage from '../../pages/superadmin/HomePage';
import Testing from '../../pages/superadmin/Testing';

//Admin
import AdminHome from '../../pages/admin/AdminHome';
import AdminTest from '../../pages/admin/AdminTest';

//User
import UserHome from '../../pages/user/UserHome';
import UserTest from '../../pages/user/UserTest';

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const isSuperadmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  //Land page viwing...
  const defaultPage = isSuperadmin ? "Home" : isAdmin ? "AdminHome" : isUser ? "UserHome" : "";

  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [displayContent, setDisplayContent] = useState(defaultPage);

  // Base pages always available
  const basePages = {
    ...(isSuperadmin ? { 'Home': <div className="h-full"><HomePage setDisplayContent={setDisplayContent} /></div>  } : {}),
    ...(isAdmin ? { 'AdminHome': <div className="h-full"><AdminHome setDisplayContent={setDisplayContent} /></div>  } : {}),
    ...(isUser ? { 'AdminHome': <div className="h-full"><UserHome setDisplayContent={setDisplayContent} /></div>  } : {}),
  };

  // Only show in sidebar if user has access
  const sidebarPages = {
    ...(isSuperadmin ? { 'Home': true, 'Testing': true } : {}),
    ...(isAdmin ? { 'AdminHome': true, 'AdminTest': true } : {}),
    ...(isUser ? { 'UserHome': true, 'UserTest': true } : {}),
  };

  const allContent = {
    //Superadmin
    'Home': <div className="h-full"><HomePage setDisplayContent={setDisplayContent} /></div>,
    'Testing': <div className="h-full"><Testing /></div>,

    //Admin
    'AdminHome': <div className="h-full"><AdminHome setDisplayContent={setDisplayContent} /></div>,
    'AdminTest': <div className="h-full"><AdminTest /></div>,

    //User
    'UserHome': <div className="h-full"><UserHome setDisplayContent={setDisplayContent} /></div>,
    'UserTest': <div className="h-full"><UserTest /></div>,
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setDisplayContent(page); // Sync content when clicking sidebar
    setIsOpen(false);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-30 w-[270px] bg-BackgroundColor text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col pt-[70px]`}
      >
        <div className="flex-1">
          <div className='font-semibold px-4 my-5 opacity-75'>
            <p>Dashboard</p>
            <hr />
          </div>
          {Object.keys(sidebarPages).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-full text-left py-3 px-6 hover:bg-blue-900 hover:text-white transition-colors ${
                currentPage === page ? 'bg-white font-semibold text-black' : ''
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-BackgroundColor text-white rounded-md"
        onClick={toggleMenu}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Main Content Area */}
      <div className="flex-1">
        {allContent[displayContent]}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

export default SideNavbar;