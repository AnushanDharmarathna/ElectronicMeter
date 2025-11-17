import React, { useContext } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from '@heroui/react';
import { AuthContext } from '../../context/AuthContext';
import BgItems from '../../assets/Js/BgItems';
import { useNavigate } from 'react-router-dom'

const AvatarButton = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(user);
  

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: BgItems.AvaterIcon,
            }}
            className="transition-transform"
            description={`@${user?.username || 'user'}`}
            name={'Superadmin'}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2 pointer-events-none">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@{user?.username || 'user'}</p>
          </DropdownItem>
          <DropdownItem key="home" color="success" onClick={() => navigate('/home')}>
            Home
          </DropdownItem>
          <DropdownItem key="settings" color="success" onClick={() => navigate('/settings')}>
            Account Settings
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={logout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AvatarButton;