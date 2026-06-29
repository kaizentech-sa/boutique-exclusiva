import { apiGet, apiGetWithHeaders, apiPost, apiPut } from './api';
import { transformWooCommerceProducts, transformWooCommerceProduct } from '../utils/helpers';

export async function getProducts(params = {}) {
  // Filter out undefined values to prevent 400 errors
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  
  
  // Use headers to extract pagination info
  const { data: raw, headers } = await apiGetWithHeaders('/products', filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  // WordPress returns: {success: true, data: [...], total: 5}
  // Extract the actual products array from the WordPress response
  let productsArray = raw;
  if (raw && typeof raw === 'object' && raw.success && Array.isArray(raw.data)) {
    productsArray = raw.data;
  }
  
  const data = transformWooCommerceProducts(productsArray);
  
  // Use WordPress response total or fallback to data length
  const total = raw && raw.total ? raw.total : (parseInt(headers['x-wp-total'] || headers['X-WP-Total'] || data.length, 10));
  const totalPages = parseInt(headers['x-wp-totalpages'] || headers['X-WP-TotalPages'] || '1', 10);
  return { data, total, totalPages, currentPage: filteredParams.page || 1 };
}

// Raw products without transform (useful for metadata discovery like attributes)
export async function getRawProducts(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const { data, headers } = await apiGetWithHeaders('/products', filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  // WordPress returns: {success: true, data: [...], total: 5}
  let productsArray = data;
  if (data && typeof data === 'object' && data.success && Array.isArray(data.data)) {
    productsArray = data.data;
  }
  
  const total = data && data.total ? data.total : (parseInt(headers['x-wp-total'] || headers['X-WP-Total'] || productsArray.length, 10));
  const totalPages = parseInt(headers['x-wp-totalpages'] || headers['X-WP-TotalPages'] || '1', 10);
  return { data: productsArray, total, totalPages, currentPage: filteredParams.page || 1 };
}

export async function getProduct(id, params = {}) { 
  const r = await apiGet(`/products/${id}`, params); 
  
  // SECURITY UPDATE: Handle WordPress backend response format
  // WordPress returns: {success: true, data: {...}} or just the product object
  let productData = r;
  if (r && typeof r === 'object' && r.success && r.data) {
    productData = r.data;
  }
  
  return transformWooCommerceProduct(productData); 
}
export async function getBrands(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet('/products/brands', filteredParams);
  // WordPress returns: {success: true, data: [...]} or just the array
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  return r;
}
export async function getCategories(params = {}) { 
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet('/products/categories', filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  // WordPress returns: {success: true, data: [...]} or just the categories array
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  
  return r;
}

export async function createOrder(orderData) { 
  const r = await apiPost('/orders', orderData); 
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success) {
    return { 
      success: true, 
      orderId: r.order_id || r.id, 
      orderNumber: r.order_number || r.number 
    };
  }
  
  return { success: true, orderId: r.id, orderNumber: r.number }; 
}
export async function updateOrderStatus(orderId, status) { return await apiPut(`/orders/${orderId}`, { status }); }

// Brand helpers using WooCommerce attributes (e.g., attribute with slug 'brand')
export async function getProductAttributes(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet('/products/attributes', filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  
  return r;
}

export async function getProductAttributeTerms(attributeId, params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet(`/products/attributes/${attributeId}/terms`, filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  
  return r;
}

// Get linked products (upsells and cross-sells)
export async function getLinkedProducts(productId) {
  const r = await apiGet(`/products/${productId}/linked`);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success) {
    const upsells = transformWooCommerceProducts(r.upsells || []);
    const crossSells = transformWooCommerceProducts(r.cross_sells || []);
    return { 
      upsells, 
      crossSells,
      totalUpsells: r.total_upsells || upsells.length,
      totalCrossSells: r.total_cross_sells || crossSells.length
    };
  }
  
  return { upsells: [], crossSells: [], totalUpsells: 0, totalCrossSells: 0 };
}


