import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import BgItems from '../../assets/Js/BgItems';
import AvatarButton from '../../components/avatarButton/AvatarButton';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white fixed z-40 w-full h-[70px] flex items-center px-5 shadow-lg shadow-blue-900/50 justify-between">
      <div>
        <Link to="/dashboard">
          <img src={BgItems.KlassmateLogo} alt="Klassmate Logo" className="w-[250px] ml-12 md:ml-0 transition-transform duration-300" />
        </Link>
      </div>
      {user && (
        <div>
          <AvatarButton />
        </div>
      )}
    </div>
  );
};

export default Navbar;