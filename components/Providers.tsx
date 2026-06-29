'use client';

import { ShopProvider, useShop } from '@/shop/core/ShopProvider';
import { CartDrawer } from '@/shop/ui/CartDrawer';

function CartDrawerConnected() {
  const { cart, isCartOpen, setIsCartOpen } = useShop();
  return (
    <CartDrawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cart.items}
      total={cart.total}
      onUpdateQuantity={cart.updateQuantity}
      onRemoveItem={cart.removeItem}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <CartDrawerConnected />
      {children}
    </ShopProvider>
  );
}
