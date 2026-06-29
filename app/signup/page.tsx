'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) return;
    localStorage.setItem('email', form.email);
    localStorage.setItem('password', form.password);
    router.push('/');
  }

  return (
    <section id="login">
      <div className="container">
        <h1 className="section-header">Create account</h1>
        <div id="form">
          <input type="text" name="fname" placeholder="First Name" value={form.fname} onChange={handleChange} />
          <input type="text" name="lname" placeholder="Last Name" value={form.lname} onChange={handleChange} />
          <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <div className="submit">
            <button id="btn-login" onClick={handleSubmit}>Create</button>
            <Link href="/" id="signup">Return to store</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
