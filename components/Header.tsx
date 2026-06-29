'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, User, ShoppingBag, LogOut, ArrowUp } from 'lucide-react';
import { useShop } from '@/shop/core/ShopProvider';

export default function Header() {
  const { cart, setIsCartOpen } = useShop();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('email'));

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowScrollBtn(currentScroll > 20);

      const header = headerRef.current;
      if (!header) return;
      if (currentScroll === 0) {
        header.classList.remove('scroll-down', 'scroll-up');
      } else if (currentScroll > lastScrollRef.current) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
      } else if (currentScroll < lastScrollRef.current && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
      }
      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleLogout() {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    setIsLoggedIn(false);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <header id="header" ref={headerRef}>
        <div className="header_top">
          <div className="header_social">
            <a href="https://www.instagram.com/sa__fashionstyle/?igsh=eWpjbWFqc3FlbGhl" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={19} />
            </a>
            <a href="https://www.facebook.com/people/SA_Fashionstyle/100088622209447/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={19} />
            </a>
            <a href="https://wa.me/201007738790" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={19} />
            </a>
          </div>

          <Link href="/" className="wordmark" id="logo">
            Boutique Exclusiva
          </Link>

          <div className="header_actions">
            {isLoggedIn ? (
              <div id="display_login" style={{ display: 'flex' }}>
                <a href="#" id="logout" onClick={handleLogout} title="Logout">
                  <span id="signout">Sign Out</span>
                  <LogOut size={19} />
                </a>
              </div>
            ) : (
              <Link href="/login" title="Login" id="login_btn">
                <User size={19} />
              </Link>
            )}

            <a
              href="#"
              className="icon-cart"
              onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              <span id="cart-counter">{cart.itemCount > 0 ? cart.itemCount : 0}</span>
            </a>
          </div>
        </div>

        <nav id="navbar">
          <menu>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Shop</Link></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </menu>
        </nav>
      </header>

      {showScrollBtn && (
        <button id="scrollBtn" onClick={scrollToTop} aria-label="Scroll to top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowUp size={18} id="btn-up" />
        </button>
      )}
    </>
  );
}
