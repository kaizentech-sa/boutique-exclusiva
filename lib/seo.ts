export const BRAND = {
  name: 'Boutique Exclusiva',
  tagline: 'Elevate Your Style',
  description:
    'Discover the latest trends in fashion for women and men at Boutique Exclusiva. Shop our wide selection of clothes, bags, jewelry, and more.',
  url: 'https://boutique-exclusiva.co.za',
  email: 'info@boutique-exclusiva.co.za',
};

export type PickupBranchId = string;

interface PickupBranch {
  label: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export const PICKUP_BRANCHES: Record<PickupBranchId, PickupBranch> = {};
