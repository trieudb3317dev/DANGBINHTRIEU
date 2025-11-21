'use client';

import React from 'react';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validatePhone,
} from '@/utils/validate';
import notify from '@/utils/notify';

export default function SignUpPage() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [remember, setRemember] = React.useState(false);

  const usernameError = validateName(username);
  const emailError = validateEmail(email);
  const phoneError = validatePhone(phone);
  const passwordError = validatePassword(password);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return notify('error', usernameError);
    if (emailError) return notify('error', emailError);
    if (phoneError) return notify('error', phoneError);
    if (passwordError) return notify('error', passwordError);
    if (validatePasswordConfirm(password, passwordConfirm))
      return notify('error', validatePasswordConfirm(password, passwordConfirm));
    if (!remember) return notify('error', 'You must agree to remember me.');
    // TODO: xử lý đăng ký
    notify('success', 'Sign up successful!');
    console.log('signup', { username, email, phone, password, remember });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <label className="block">
        <div className="text-xs text-zinc-500 mb-2">Username</div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100"
          placeholder="Username"
        />
        {/* Add validation error message for username here */}
        {usernameError && <span className="text-xs text-red-500 mt-1">{usernameError}</span>}
      </label>

      <label className="block">
        <div className="text-xs text-zinc-500 mb-2">Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100"
          placeholder="Email"
        />
        {emailError && <span className="text-xs text-red-500 mt-1">{emailError}</span>}
      </label>

      <label className="block">
        <div className="text-xs text-zinc-500 mb-2">Phone</div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100"
          placeholder="Phone"
        />
        {phoneError && <span className="text-xs text-red-500 mt-1">{phoneError}</span>}
      </label>

      <label className="block">
        <div className="text-xs text-zinc-500 mb-2">Password</div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 pr-10 bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100"
            placeholder="Password"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          >
            {showPassword ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
          </button>
        </div>
        {passwordError && <span className="text-xs text-red-500 mt-1">{passwordError}</span>}
      </label>

      <label className="block">
        <div className="text-xs text-zinc-500 mb-2">Confirm Password</div>
        <div className="relative">
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 pr-10 bg-white dark:bg-transparent text-zinc-900 dark:text-zinc-100"
            placeholder="Confirm Password"
          />
          <button
            type="button"
            aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
            onClick={() => setShowPasswordConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          >
            {showPasswordConfirm ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
          </button>
        </div>
        {validatePasswordConfirm(password, passwordConfirm) && (
          <span className="text-xs text-red-500 mt-1">{validatePasswordConfirm(password, passwordConfirm)}</span>
        )}
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4" />
        Remember me
      </label>

      <button
        type="submit"
        className="w-full mt-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded shadow-sm"
      >
        Continue
      </button>
    </form>
  );
}
