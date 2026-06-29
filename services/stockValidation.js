import { API_CONFIG } from '../shop/utils/constants';

/**
 * Validate stock levels before payment processing
 * This prevents overselling by checking stock BEFORE PayFast redirect
 */
export async function validateStockBeforePayment(cartItems) {
  try {
    // Format cart items for backend validation
    const lineItems = cartItems.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      // Include variation data if present
      ...(item.variationId && {
        variation_id: item.variationId,
        variation: item.variationAttributes || {}
      })
    }));

    // Call WordPress stock validation endpoint
    const response = await fetch(`${API_CONFIG.BASE_URL}/validate-stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.API_KEY,
      },
      body: JSON.stringify({
        line_items: lineItems
      }),
    });

    if (!response.ok) {
      throw new Error(`Stock validation API error: ${response.status}`);
    }

    const result = await response.json();

    // Return validation result
    return {
      success: result.success,
      valid: result.valid,
      error: result.error,
      message: result.message,
      redirectUrl: result.redirect_url,
      validationResults: result.validation_results
    };

  } catch (error) {
    console.error('Error validating stock:', error);
    return {
      success: false,
      valid: false,
      error: 'validation_failed',
      message: 'Unable to validate stock levels. Please try again.',
    };
  }
}
