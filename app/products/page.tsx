'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid3x3 } from 'lucide-react';
import { useShop } from '@/shop/core/ShopProvider';
import { formatPrice } from '@/shop/utils/helpers';
import type { Category } from '@/shop/core/ports';

const SORT_OPTIONS = [
  { value: '', label: 'Alphabetically, Z-A' },
  { value: 'featured', label: 'Featured' },
  { value: 'date', label: 'Best Selling' },
];

export default function ProductsPage() {
  const { products, categories, cart } = useShop();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchWithFilters(undefined, sort);
    categories.fetchCategories();
  }, []);

  function fetchWithFilters(categoryId?: number, sortVal?: string) {
    let orderBy: 'name' | 'date' | 'popularity' | undefined;
    let order: 'asc' | 'desc' | undefined;
    let featured: boolean | undefined;

    if (sortVal === 'featured') {
      featured = true;
    } else if (sortVal === 'date') {
      orderBy = 'date';
      order = 'desc';
    } else {
      orderBy = 'name';
      order = 'desc';
    }

    products.fetchProducts({
      perPage: 50,
      categoryId,
      orderBy,
      order,
      featured,
    });
  }

  function handleCategoryClick(cat: Category) {
    setActiveCategory(cat.name);
    setActiveCategoryId(cat.id);
    setSidebarOpen(false);
    fetchWithFilters(cat.id, sort);
  }

  function handleShowAll() {
    setActiveCategory(null);
    setActiveCategoryId(undefined);
    fetchWithFilters(undefined, sort);
  }

  function handleSortChange(val: string) {
    setSort(val);
    fetchWithFilters(activeCategoryId, val);
  }

  function handleAddToCart(product: any) {
    cart.addItem(product);
  }

  return (
    <div className="products-page">
      <main>
        <div className="product-header">
          <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Grid3x3 size={24} />
          </div>
          <div className="product-header-right">
            <div className="sortBy">
              <span>Sort By :</span>
              <select id="sort" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <span id="productCount">{products.total > 0 ? `${products.total} products` : ''}</span>
          </div>
        </div>

        <div className="container" style={{ position: 'relative' }}>
          {/* Sidebar */}
          <div className={`aside${sidebarOpen ? ' open' : ''}`}>
            <h2>Categories</h2>
            <div className="shop_categories">
              <a
                href="#"
                className={`categories_link${!activeCategory ? ' active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleShowAll(); }}
              >
                All
              </a>
              {categories.categories.map((cat) => (
                <a
                  key={cat.id}
                  href="#"
                  className={`categories_link${activeCategory === cat.name ? ' active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleCategoryClick(cat); }}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div className="products-grid">
            <div className="content" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {products.loading && (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '60px 0' }}>
                  Loading...
                </p>
              )}
              {!products.loading && products.products.length === 0 && (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '60px 0' }}>
                  No products found
                </p>
              )}
              {products.products.map((product) => (
                <div key={product.id} className="product-card" data-id={product.id}>
                  <div className="card-img">
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.images?.[0] || '/images/logowhite.jpg'}
                        alt={product.name}
                      />
                    </Link>
                    <a
                      href="#"
                      className="addToCart"
                      onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                    />
                  </div>
                  <div className="card-info">
                    <Link href={`/products/${product.id}`}>
                      <h4 className="product-name">{product.name}</h4>
                    </Link>
                    <h5 className="product-price">{formatPrice(product.price)}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
