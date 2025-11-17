import React, { useState, useContext } from 'react'
import HomePage from '../../pages/HomePage';
import { AuthContext } from '../../context/AuthContext';

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home');

  const { user } = useContext(AuthContext);

  const isSuperadmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const pages = {
    ...(isSuperadmin ? { 'Home': <div className="h-full"><HomePage/></div> } : {}),

    ...(isAdmin ? { 'Home': <div className="h-full"><HomePage/></div> } : {}),

    ...(isUser ? { 'Home': <div className="h-full"><HomePage/></div> } : {}),
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsOpen(false); // Close menu on mobile after selection
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
                <hr/>
            </div>
            {Object.keys(pages).map((page) => (
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

      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-BackgroundColor text-white rounded-md"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
          />
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 ">
        {pages[currentPage]}
      </div>

      {/* Overlay for Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default SideNavbar;