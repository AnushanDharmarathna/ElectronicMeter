import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, addToast } from '@heroui/react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../layout/navbar/Navbar'
import Icons from '../assets/Js/Icons';

const Settings = () => {
  const { token, user, updateAuth } = useContext(AuthContext);
  const [usernameForm, setUsernameForm] = useState({
    oldUsername: user?.username || '',
    newUsername: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle username form change
  const handleUsernameChange = (e) => {
    setUsernameForm({ ...usernameForm, [e.target.name]: e.target.value });
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    // setError('');
    // setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/change-username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usernameForm),
      });
      const data = await response.json();
      if (response.ok) {
        if (typeof updateAuth === 'function') {
          updateAuth(data.token, data.user);
        } else {
          console.warn('updateAuth is not a function; AuthContext may need updating');
        }
        setUsernameForm({ oldUsername: data.user.username, newUsername: '' });
        // setSuccess('Username updated successfully');
        addToast({
          title: 'Username updated successfully',
          color: "success"
        });
      } else {
        // setError(data.error || 'Failed to update username');
        addToast({
          title: 'Failed to update username',
          color: "danger"
        });
      }
    } catch (err) {
      // setError('Error updating username: ' + err.message);
      addToast({
          title: 'Failed to update username',
          color: "danger"
        });
      // console.error('Username update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        // setSuccess('Password updated successfully');
        addToast({
          title: 'Password updated successfully',
          color: "success"
        });
      } else {
        setError(data.error || 'Failed to update password');
        addToast({
          title: 'Failed to update password',
          color: "danger"
        });
      }
    } catch (err) {
      setError('Error updating password: ' + err.message);
      addToast({
          title: 'Failed to update password',
          color: "danger"
        });
      // console.error('Password update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = (formType) => {
    if (formType === 'username') {
      setUsernameForm({ oldUsername: user?.username || '', newUsername: '' });
    } else {
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
    setError('');
    // setSuccess('');
  };

  useEffect(() => {
  if (error) {
      const timer = setTimeout(() => {
      setError('')
      }, 5000)

      return () => clearTimeout(timer);
  }
  }, [error])

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="h-full w-full">
      <div>
        <Navbar/>
        a
      </div>
      <div className='mt-[70px] px-20 h-full flex flex-col justify-center'>

        {/* Username Change */}
        <div className='w-full'>
          <p className='text-lg font-semibold'>Change Username</p>
          <hr className='border-[1px] border-black'/>
          <Form className='flex w-full gap-5 mt-5' onSubmit={handleUsernameSubmit} onReset={() => handleReset('username')}>
            <div className="flex -mb-[12px]">
              <label className="text-black text-sm">Old Username</label>
              <p className="text-red-600">*</p>
            </div>
            <Input
              isRequired
              errorMessage="Please enter a valid username"
              name="oldUsername"
              placeholder="Enter your username"
              value={usernameForm.oldUsername}
              onChange={handleUsernameChange}
              type="text"
              disabled={loading}
            />
            <div className="flex -mb-[12px]">
              <label className="text-black text-sm">New Username</label>
              <p className="text-red-600">*</p>
            </div>
            <Input
              isRequired
              errorMessage="Please enter a valid username"
              name="newUsername"
              placeholder="Enter your new username"
              value={usernameForm.newUsername}
              onChange={handleUsernameChange}
              type="text"
              disabled={loading}
            />
            <div className="flex gap-2 justify-end items-end w-full">
              <Button type="reset" variant="flat" disabled={loading}>
                Clear
              </Button>
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? 'Changing...' : 'Change Username'}
              </Button>
            </div>
          </Form>
        </div>

        {/* Password Change */}
        <div className='w-full my-5'>
          <p className='text-lg font-semibold'>Change Password</p>
          <hr className='border-[1px] border-black'/>
          <Form className='flex w-full gap-5 mt-5' onSubmit={handlePasswordSubmit} onReset={() => handleReset('password')}>
            <div className="flex -mb-[12px]">
              <label className="text-black text-sm">Old Password</label>
              <p className="text-red-600">*</p>
            </div>
            <div className='relative w-full'>
              <Input
                isRequired
                errorMessage="Please enter a valid password"
                name="oldPassword"
                placeholder="Enter your old password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                type={showOldPassword ? "text" : "password"}
                disabled={loading}
                endContent={<Icons.OpenEye color='white'/>}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute flex items-center text-gray-500 top-[10px] right-3"
              >
                {showOldPassword ? <Icons.OpenEye size={20} /> : <Icons.CloseEye size={20} />}
              </button>
            </div>
            <div className="flex -mb-[12px]">
              <label className="text-black text-sm">New Password</label>
              <p className="text-red-600">*</p>
            </div>
            <div className='w-full relative'>
              <Input
                isRequired
                errorMessage="Please enter a valid password"
                name="newPassword"
                placeholder="Enter your new password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                type={showNewPassword ? "text" : "password"}
                disabled={loading}
                endContent={<Icons.OpenEye color='white'/>}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute flex items-center text-gray-500 top-[10px] right-3"
              >
                {showNewPassword ? <Icons.OpenEye size={20} /> : <Icons.CloseEye size={20} />}
              </button>
            </div>
            <div className="flex -mb-[12px]">
              <label className="text-black text-sm">Confirm Password</label>
              <p className="text-red-600">*</p>
            </div>
            <div className='w-full relative'>
              <Input
                isRequired
                errorMessage="Please enter a valid password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                type={showConfirmPassword ? "text" : "password"}
                disabled={loading}
                endContent={<Icons.OpenEye color='white'/>}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute flex items-center text-gray-500 top-[10px] right-3"
              >
                {showConfirmPassword ? <Icons.OpenEye size={20} /> : <Icons.CloseEye size={20} />}
              </button>
            </div>
            {error && <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>}
            <div className="flex gap-2 justify-end items-end w-full">
              <Button type="reset" variant="flat" disabled={loading}>
                Clear
              </Button>
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </Form>
          {/* {success && <p className="mt-4 text-center text-green-600 font-semibold">{success}</p>} */}
        </div>
      </div>
    </div>
  );
};

export default Settings;