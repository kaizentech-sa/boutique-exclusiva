'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Slider from '@/components/Slider';
import { useShop } from '@/shop/core/ShopProvider';
import { formatPrice } from '@/shop/utils/helpers';

const SLIDES = [
  { image: '/images/background/slide16_bdfdea89-9df3-48da-9f0a-888fd50a83d5.webp', heading: 'Get up to 30% Off New Arrivals' },
  { image: '/images/background/background2.webp', heading: 'Get up to 30% Off New Arrivals' },
  { image: '/images/background/background3.webp', heading: 'Get up to 30% Off New Arrivals' },
];

export default function HomePage() {
  const { products, cart } = useShop();

  useEffect(() => {
    products.fetchProducts({ featured: true, perPage: 8 });
  }, []);

  function handleAddToCart(product: any) {
    cart.addItem(product);
  }

  return (
    <>
      {/* Desktop hero slider */}
      <Slider slides={SLIDES} />

      {/* Mobile hero */}
      <div className="hero_for_phone">
        <div className="hero-content">
          <Image
            src="/images/background/phone.webp"
            alt="Mini Collection"
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
          <div className="text">
            <h2>Mini Collection</h2>
            <p>Colour the summer in hot fuschia, bubblegum pink</p>
            <Link href="/products" className="shop-btn">Shop Now</Link>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="information">
        <div className="info">
          <div className="info-icon"><Image src="/images/global-distribution.png" alt="Shipping" width={46} height={46} /></div>
          <div className="info-text">
            <h3>Shipping Worldwide</h3>
            <p>Free delivery across South Africa &amp; Angola on orders above R 1 500</p>
          </div>
        </div>
        <div className="info">
          <div className="info-icon"><Image src="/images/delivery-status.png" alt="Returns" width={46} height={46} /></div>
          <div className="info-text">
            <h3>14 Days Return</h3>
            <p>Simply return it within 30 days for an exchange.</p>
          </div>
        </div>
        <div className="info">
          <div className="info-icon"><Image src="/images/check.png" alt="Security" width={46} height={46} /></div>
          <div className="info-text">
            <h3>Security Payment</h3>
            <p>We ensure secure payment with PEV</p>
          </div>
        </div>
        <div className="info">
          <div className="info-icon"><Image src="/images/24-hours-support.png" alt="Support" width={46} height={46} /></div>
          <div className="info-text">
            <h3>24/7 Support</h3>
            <p>Contact us 24 hours a day, 7 days a week</p>
          </div>
        </div>
      </div>

      {/* Trending products */}
      <div className="top_products">
        <div className="container">
          <div className="header">
            <h3>Trending Products</h3>
            <p>Follow the most popular trends and get exclusive items from Boutique Exclusiva.</p>
          </div>
          <div className="products" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {products.loading && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Loading...
              </p>
            )}
            {!products.loading && products.products.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                No trending products available
              </p>
            )}
            {products.products.map((product) => (
              <div key={product.id} className="product-card" data-id={product.id}>
                <div className="card-img">
                  <img
                    src={product.images?.[0] || '/images/logowhite.jpg'}
                    alt={product.name}
                    onClick={() => window.location.href = `/products/${product.id}`}
                  />
                  <a
                    href="#"
                    className="addToCart"
                    onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                  >
                  </a>
                </div>
                <div className="card-info">
                  <h4 className="product-name" onClick={() => window.location.href = `/products/${product.id}`}>
                    {product.name}
                  </h4>
                  <h5 className="product-price">{formatPrice(product.price)}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="collection" id="collection" aria-label="collection">
        <div className="container">
          <ul className="collection-list">
            <li>
              <div className="collection-card has-before hover:shine">
                <h2 className="card-title">Summer Collection</h2>
                <p className="card-text">Starting at R 350</p>
                <Link href="/products" className="btn-link">
                  <span>Shop Now</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <div className="has-bg-image" style={{ backgroundImage: "url('/images/background/banner1.webp')" }} />
              </div>
            </li>
            <li>
              <div className="collection-card has-before hover:shine">
                <h2 className="card-title">What&apos;s New?</h2>
                <p className="card-text">Get the glow</p>
                <a href="#" className="btn-link">
                  <span>Discover Now</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
                <div className="has-bg-image" style={{ backgroundImage: "url('/images/background/banner2.webp')" }} />
              </div>
            </li>
            <li>
              <div className="collection-card has-before hover:shine">
                <h2 className="card-title">Buy 1 Get 1</h2>
                <p className="card-text">Starting at R 150</p>
                <a href="#" className="btn-link">
                  <span>Discover Now</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
                <div className="has-bg-image" style={{ backgroundImage: "url('/images/background/banner3.webp')" }} />
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="news hight">
        <div className="news-text">
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter and get 20% off your first purchase</p>
        </div>
        <div className="Subscribe-form">
          <input type="email" name="email" placeholder="Enter Your Email" autoComplete="off" />
          <button type="submit">
            <Image src="/images/send.png" alt="subscribe" width={24} height={24} />
          </button>
        </div>
      </div>
    </>
  );
}
