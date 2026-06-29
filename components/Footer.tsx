import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">
          <Link href="/" className="wordmark">Boutique Exclusiva</Link>
          <p>The customer is at the heart of our unique business model, which includes design.</p>
        </div>
        <div className="footer-list">
          <div className="list">
            <h4>Shopping</h4>
            <ul>
              <li><Link href="/products">Clothing Store</Link></li>
              <li><Link href="/products">Trending Shoes</Link></li>
              <li><Link href="/products">Accessories</Link></li>
              <li><Link href="/products">Sale</Link></li>
            </ul>
          </div>
          <div className="list">
            <h4>Customer Services</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Payment Methods</a></li>
              <li><a href="#">Delivery</a></li>
              <li><a href="#">Return &amp; Exchanges</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-company-name">
          &copy; {new Date().getFullYear()} Boutique Exclusiva. Developed by{' '}
          <a href="#" id="author">Kaizen Technology</a>
        </p>
      </div>
    </footer>
  );
}
