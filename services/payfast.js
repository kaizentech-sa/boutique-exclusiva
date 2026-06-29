import { PAYFAST_CONFIG, API_CONFIG } from '../shop/utils/constants';

/**
 * Generate PayFast payment data for checkout
 * This is now a simple data formatter - NO SECRETS OR SIGNATURE GENERATION
 * All security is handled by WordPress backend
 */
export function generatePayFastPaymentData({ orderId, orderNumber, customerName, customerEmail, customerPhone, amount, itemName, itemDescription }) {
  // Split customer name properly
  const nameParts = (customerName || '').trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Create payment data WITHOUT merchant credentials or signature
  // WordPress backend will add these securely
  const paymentData = {
    name_first: firstName,
    name_last: lastName,
    email_address: customerEmail,
    cell_number: customerPhone && customerPhone.trim() ? customerPhone.trim() : undefined,
    amount: Number(amount || 0).toFixed(2),
    item_name: itemName,
    item_description: itemDescription || itemName,
    custom_str1: String(orderId),
    custom_str2: String(orderNumber),
    custom_str3: 'Oracle Gaming',
    return_url: PAYFAST_CONFIG.RETURN_URL,
    cancel_url: PAYFAST_CONFIG.CANCEL_URL,
  };
  
  
  return paymentData;
}

/**
 * Submit PayFast payment via WordPress secure endpoint
 * WordPress backend handles all secrets and signature generation
 */
export async function submitPayFastPayment(paymentData) {
  try {
    
    // Call WordPress endpoint to generate PayFast payment data with signature
    const response = await fetch(`${API_CONFIG.BASE_URL}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.API_KEY,
      },
      body: JSON.stringify({
        customer_name: paymentData.name_first + ' ' + (paymentData.name_last || ''),
        customer_email: paymentData.email_address,
        amount: paymentData.amount,
        item_name: paymentData.item_name,
        order_id: paymentData.custom_str1,
        return_url: paymentData.return_url,
        cancel_url: paymentData.cancel_url,
      }),
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const result = await response.json();

    // ✅ Handle stock validation responses
    if (!result.success) {
      if (result.error === 'insufficient_stock') {
        // Redirect to payment failure page for stock issues
        window.location.href = result.redirect_url || '/payment/failure?reason=out_of_stock';
        return {
          success: false,
          error: 'insufficient_stock',
          message: result.message || 'Items no longer available'
        };
      }
      throw new Error(result.error || 'Failed to create payment');
    }

    // ✅ Create and submit form SYNCHRONOUSLY (no setTimeout, no race condition)
    // This is the ONLY reliable way to submit to PayFast
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = result.payment_url;
    form.style.display = 'none';
    
    // Add form fields from WordPress response (includes signature)
    Object.entries(result.form_data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    // Add form to document
    document.body.appendChild(form);
    
    // ✅ Submit immediately - SYNCHRONOUS (blocks execution)
    // Browser will navigate to PayFast, page will unload
    // Code after this line will NOT execute (page navigates away)
    form.submit();
    
    // This return will never be reached because browser navigates away
    // But we include it for TypeScript/error handling edge cases
    return {
      success: true,
      message: 'Redirecting to PayFast...',
      redirectUrl: result.payment_url,
    };
  } catch (error) {
    console.error('Error submitting PayFast payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit payment',
    };
  }
}

/**
 * REMOVED: generatePayFastFormData - no longer needed
 * Signature generation is now handled securely by WordPress backend
 */
