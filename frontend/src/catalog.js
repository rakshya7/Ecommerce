// Category keys match the `category` field stored on products.
export const CATEGORIES = [
  { key: "men", label: "Men", title: "Men’s shoes", path: "/mens" },
  { key: "women", label: "Women", title: "Women’s shoes", path: "/womens" },
  { key: "kid", label: "Kids", title: "Kids’ shoes", path: "/kids" },
];

// The one place the storefront's currency is defined.
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  trailingZeroDisplay: "stripIfInteger",
});

export const formatPrice = (amount) => money.format(amount);

// Whole-number percentage off; 0 when the product isn't discounted.
export const discountOf = ({ new_price, old_price }) =>
  old_price > new_price ? Math.round((1 - new_price / old_price) * 100) : 0;

export const SORTS = {
  featured: { label: "Featured" },
  newest: { label: "Newest", compare: (a, b) => new Date(b.date) - new Date(a.date) },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.new_price - b.new_price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.new_price - a.new_price },
  discount: { label: "Biggest discount", compare: (a, b) => discountOf(b) - discountOf(a) },
};
