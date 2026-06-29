'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/shop/core/ShopProvider';
import { formatPrice } from '@/shop/utils/helpers';

const DELIVERY_FEE = 150;

export default function CartPage() {
  const router = useRouter();
  const { cart } = useShop();
  const { items, total, updateQuantity, removeItem } = cart;

  const grandTotal = total + (items.length > 0 ? DELIVERY_FEE : 0);

  function handleCheckout() {
    const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null;
    if (!email) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  }

  return (
    <main className="cart_page">
      <div className="container">
        <h1>Shopping Bag</h1>
        <div className="content">
          {/* Left: items */}
          <div className="left_side_cart">
            <div className="cart_title">
              <h2>
                My shopping bag{' '}
                <span id="cart_counts">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              </h2>
            </div>
            <div className="cart_products">
              {items.length === 0 && (
                <div className="empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
                  <p style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                    Your bag is empty
                  </p>
                  <Link href="/products" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'underline !important', color: 'var(--ink)' }}>
                    Continue Shopping
                  </Link>
                </div>
              )}
              {items.map((item) => (
                <div key={`${item.productId}-${item.variationId ?? 'default'}`} className="cart_product">
                  <div className="cart_product_img">
                    <img src={item.image || '/images/logowhite.jpg'} alt={item.name} />
                  </div>
                  <div className="cart_product_info">
                    <div className="top_card">
                      <div>
                        <h4>{item.name}</h4>
                        <span className="product_price">{formatPrice(item.price)}</span>
                      </div>
                      <button
                        className="remove_product"
                        onClick={() => removeItem(item.productId, item.variationId)}
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                    <div className="buttom_card">
                      <div className="counts">
                        <button
                          className="counts_btns minus"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variationId)}
                        >-</button>
                        <input
                          type="number"
                          className="product_count"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, Number(e.target.value), item.variationId)}
                          min={1}
                          max={99}
                          inputMode="numeric"
                        />
                        <button
                          className="counts_btns plus"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variationId)}
                        >+</button>
                      </div>
                      <span className="total_price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: summary */}
          <div className="right_side_cart">
            <div className="Promotional_code">
              <h2>Do you have a Promotional Code?</h2>
              <div className="apply_code">
                <input type="text" id="code" placeholder="Promo code" />
                <button type="button">Done</button>
              </div>
            </div>
            <div className="summary">
              <h2>Order Summary</h2>
              <div className="summary_price">
                <div>
                  <h4>Subtotal</h4>
                  <span id="Subtotal">{formatPrice(total)}</span>
                </div>
                <div className="Delivery">
                  <h4>Delivery</h4>
                  <span id="Delivery">{items.length > 0 ? formatPrice(DELIVERY_FEE) : 'R 0.00'}</span>
                </div>
                <div>
                  <h4>Total Order</h4>
                  <span id="total_order">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <button className="checkout" onClick={handleCheckout}>Check Out</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
