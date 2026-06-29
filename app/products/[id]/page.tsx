'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useShop } from '@/shop/core/ShopProvider';
import { formatPrice } from '@/shop/utils/helpers';
import type { Product } from '@/shop/core/ports';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { cart } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [lottieData, setLottieData] = useState<any>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;

    import('@/services/woocommerce').then(({ getProduct }) => {
      getProduct(id)
        .then((p) => { setProduct(p); setLoading(false); })
        .catch(() => { setLoading(false); });
    });

    fetch('/json/Animation check.json')
      .then((r) => r.json())
      .then(setLottieData)
      .catch(() => {});
  }, [params.id]);

  function handleAddToCart() {
    if (!product) return;
    const success = cart.addItem(product, quantity);
    if (success) {
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToast(false), 2500);
    }
  }

  function changeQty(delta: number) {
    setQuantity((q) => Math.min(999, Math.max(1, q + delta)));
  }

  if (loading) {
    return (
      <main className="product-detail">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-soft)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-soft)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Product not found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="product-detail">
      <div className="container">
        <div className="productDetails">
          <div className="images">
            <img
              id="product_image"
              src={product.images?.[0] || '/images/logowhite.jpg'}
              alt={product.name}
            />
          </div>
          <div className="details">
            {product.categories?.[0] && (
              <span className="category_name">{product.categories[0]}</span>
            )}
            <h2 className="product_name">{product.name}</h2>
            <h3 className="product_price">{formatPrice(product.price)}</h3>
            {product.description && (
              <p
                className="product_des"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            <div className="buttons">
              <div className="counts">
                <button id="minus" className="counts_btns" onClick={() => changeQty(-1)}>-</button>
                <input
                  type="number"
                  inputMode="numeric"
                  className="product_count"
                  id="productCount"
                  min={1}
                  max={999}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(999, Math.max(1, Number(e.target.value))))}
                />
                <button id="plus" className="counts_btns" onClick={() => changeQty(1)}>+</button>
              </div>
              <button id="btn_add" onClick={handleAddToCart}>Add To Cart</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <div className={`toast-overlay${showToast ? ' show' : ''}`} id="toast-overlay">
        <div className="success-msg">
          {lottieData && (
            <Lottie animationData={lottieData} style={{ width: 100, height: 100 }} loop={false} />
          )}
          <h4>Your item has been added to the shopping bag</h4>
        </div>
      </div>
    </main>
  );
}
