'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useShop } from '@/shop/core/ShopProvider';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, checkout } = useShop();
  const [lottieData, setLottieData] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'ZA',
    deliveryMethod: 'shipping' as 'shipping' | 'collect',
    useSameAddress: true,
  });

  useEffect(() => {
    fetch('/json/AnimationCheckoutPage.json')
      .then((r) => r.json())
      .then(setLottieData)
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('email');
      if (!email) router.push('/login');
      else setFormData((f) => ({ ...f, email }));
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.items.length === 0) return;

    const success = await checkout.processCheckout(cart.items, formData);
    if (success) {
      cart.clearCart();
      setSubmitted(true);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  if (submitted) {
    const orderId = checkout.orderId;
    const date = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    return (
      <div className="checkout-success">
        {lottieData && <Lottie animationData={lottieData} style={{ width: 200, height: 200 }} loop={false} />}
        <h4>Thank you. Your order has been received</h4>
        <div className="order-meta">
          <span>Order:</span> <strong>#{orderId}</strong>
          <span>Date:</span> <strong>{date}</strong>
        </div>
        <button id="back_btn" onClick={() => router.push('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', padding: '70px 6%' }}>
        <h1 className="section-header" style={{ textAlign: 'center', marginBottom: 40 }}>Checkout</h1>

        {checkout.error && (
          <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>
            {checkout.error}
          </p>
        )}

        <form id="form" onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />

          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange} required />

          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" placeholder="Street Address" value={formData.address} onChange={handleChange} required />

          <label htmlFor="city">City</label>
          <input id="city" name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required />

          <label htmlFor="state">Province / State</label>
          <input id="state" name="state" type="text" placeholder="Province" value={formData.state} onChange={handleChange} required />

          <label htmlFor="postcode">Postal Code</label>
          <input id="postcode" name="postcode" type="text" placeholder="Postal Code" value={formData.postcode} onChange={handleChange} required />

          <div className="submit">
            <button type="submit" disabled={checkout.loading || cart.items.length === 0}>
              {checkout.loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
