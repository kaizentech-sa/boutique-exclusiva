'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EMAIL_RE = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });

  function validateEmail() {
    if (!EMAIL_RE.test(email)) {
      setErrors((e) => ({ ...e, email: 'Email is not valid' }));
      return false;
    }
    setErrors((e) => ({ ...e, email: '' }));
    return true;
  }

  function validatePassword() {
    if (password.length < 8) {
      setErrors((e) => ({ ...e, password: 'Password must be 8 chars at least' }));
      return false;
    }
    setErrors((e) => ({ ...e, password: '' }));
    return true;
  }

  function validateConfirm() {
    if (password !== confirmPassword) {
      setErrors((e) => ({ ...e, confirm: 'Passwords do not match' }));
      return false;
    }
    setErrors((e) => ({ ...e, confirm: '' }));
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = validateEmail() && validatePassword() && validateConfirm();
    if (!ok) return;
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    router.push('/');
  }

  return (
    <section id="login">
      <div className="container">
        <h1 className="section-header">Login</h1>
        <div id="form">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            style={errors.email ? { borderColor: 'var(--accent)' } : {}}
          />
          <span className={`alert${errors.email ? ' visible' : ''}`}>{errors.email}</span>

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
            style={errors.password ? { borderColor: 'var(--accent)' } : {}}
          />
          <span className={`alert${errors.password ? ' visible' : ''}`}>{errors.password}</span>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validateConfirm}
            style={errors.confirm ? { borderColor: 'var(--accent)' } : {}}
          />
          <span className={`alert${errors.confirm ? ' visible' : ''}`}>{errors.confirm}</span>

          <div className="submit">
            <button id="btn-login" onClick={handleSubmit}>Sign In</button>
            <Link href="/signup" id="signup">New customer? Sign up for an account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
