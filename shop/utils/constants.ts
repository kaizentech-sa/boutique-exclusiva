/**
 * Buildora Hardware E-commerce Configuration Constants
 * 
 * These constants control the shop functionality. For production,
 * set values via environment variables (see CONFIGURATION_REQUIRED.md).
 * 
 * FLEXIBILITY: This setup works with ANY WordPress backend that has the
 * Oracle Gaming API structure. Just change the .env variables:
 * - NEXT_PUBLIC_WORDPRESS_URL: Your WordPress site URL
 * - NEXT_PUBLIC_API_PREFIX: API namespace (e.g., /wp-json/oracle/v1)
 * - NEXT_PUBLIC_API_KEY: Your API key
 */

import { BRAND } from "@/lib/seo";

// PayFast Configuration
// IMPORTANT: Never expose secrets on the client - all secrets are handled server-side
export const PAYFAST_CONFIG = {
  // PayFast payment gateway URL (sandbox for testing, production for live)
  PAYMENT_URL: process.env.NEXT_PUBLIC_PAYFAST_TEST_MODE === 'true'
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process',
  
  // Return URLs after payment
  RETURN_URL: process.env.NEXT_PUBLIC_PAYFAST_RETURN_URL || 'http://localhost:3000/payment/success',
  CANCEL_URL: process.env.NEXT_PUBLIC_PAYFAST_CANCEL_URL || 'http://localhost:3000/payment/failure',
  NOTIFY_URL: process.env.NEXT_PUBLIC_PAYFAST_NOTIFY_URL || '',
  
  // Test mode flag
  TEST_MODE: process.env.NEXT_PUBLIC_PAYFAST_TEST_MODE === 'true',
};

// WooCommerce/WordPress Configuration
export const WOOCOMMERCE_CONFIG = {
  // WordPress site URL (the backend that hosts WooCommerce)
  BASE_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
  
  // Custom API endpoint prefix - configurable per backend
  // Oracle Gaming uses: /wp-json/oracle/v1
  // Sam's Hardware would use: /wp-json/sams/v1
  API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || '',
  
  // API version for direct WooCommerce REST API (if needed)
  API_VERSION: 'wc/v3',
  
  // Default pagination
  PRODUCTS_PER_PAGE: 12,
  
  // Currency
  CURRENCY: process.env.NEXT_PUBLIC_CURRENCY || 'ZAR',
  CURRENCY_SYMBOL: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R',
};

// API Configuration
export const API_CONFIG = {
  // Base URL for API requests (WordPress URL + API prefix)
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  
  // API Key for secure endpoints - must match functions.php
  // Oracle Gaming uses: oracle-react-2024
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

// Shipping Configuration
export const SHIPPING_CONFIG = {
  // Free shipping threshold (in ZAR)
  FREE_SHIPPING_THRESHOLD: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 1000,
  
  // Default shipping rates (used when BobGo is unavailable)
  DEFAULT_RATES: {
    standard: {
      name: 'Standard Shipping',
      price: 75,
      deliveryTime: '3-5 business days',
    },
    express: {
      name: 'Express Shipping',
      price: 120,
      deliveryTime: '1-2 business days',
    },
  },
  
  // BobGo enabled flag
  BOBGO_ENABLED: process.env.NEXT_PUBLIC_BOBGO_ENABLED === 'true',
};

// Shop Configuration
export const SHOP_CONFIG = {
  // Store name
  STORE_NAME: BRAND.name,
  
  // Store tagline
  TAGLINE: 'Quality Tools & Equipment',
  
  // Currency settings
  CURRENCY: WOOCOMMERCE_CONFIG.CURRENCY,
  CURRENCY_SYMBOL: WOOCOMMERCE_CONFIG.CURRENCY_SYMBOL,
  
  // Pagination
  PRODUCTS_PER_PAGE: WOOCOMMERCE_CONFIG.PRODUCTS_PER_PAGE,
  
  // Cart settings
  MAX_QUANTITY_PER_ITEM: 99,
  
  // Image placeholders
  PLACEHOLDER_IMAGE: '/Images/product-placeholder.png',
  
  // Feature flags
  FEATURES: {
    reviews: true,
    wishlist: false, // Coming soon
    compareProducts: false, // Coming soon
    quickView: true,
  },
};

// Route paths for the shop
export const SHOP_ROUTES = {
  SHOP: '/products',
  PRODUCT: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT_SUCCESS: '/checkout/success',
  PAYMENT_FAILURE: '/checkout/failure',
  ORDERS: '/orders',
  BLOG: '/blog',
};

// Local storage keys
export const STORAGE_KEYS = {
  CART: 'sams_hardware_cart',
  USER: 'sams_hardware_user',
  SHIPPING_ADDRESS: 'sams_hardware_shipping_address',
  BILLING_ADDRESS: 'sams_hardware_billing_address',
  SELECTED_SHIPPING: 'sams_hardware_selected_shipping',
  COOKIE_CONSENT: 'sams_hardware_cookie_consent',
};

