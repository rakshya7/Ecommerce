export const API = 'http://localhost:4000'
export const STORE_URL = 'http://localhost:3000'

// Keys are the `category` values the storefront filters on (its kids page reads "kid").
export const CATEGORIES = [
  { key: 'women', label: 'Women' },
  { key: 'men', label: 'Men' },
  { key: 'kid', label: 'Kids' },
]

export const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label ?? key

// Same currency as the storefront (frontend/src/catalog.js).
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'NPR',
  trailingZeroDisplay: 'stripIfInteger',
})

export const formatPrice = (amount) => money.format(amount)

// Whole-number percentage off; 0 when the product isn't discounted.
export const discountOf = ({ new_price, old_price }) =>
  old_price > new_price ? Math.round((1 - new_price / old_price) * 100) : 0

// Returns { field: message } for each problem; empty when the product can be saved.
// The offer price is optional: blank means the product sells at its regular price.
export const validateProduct = ({ name, old_price, new_price }, image) => {
  const errors = {}
  const price = Number(old_price)
  const offer = Number(new_price)

  if (!name.trim()) errors.name = 'Enter a product name.'
  if (!(price > 0)) errors.old_price = 'Enter a price above 0.'
  if (new_price !== '') {
    if (!(offer > 0)) errors.new_price = 'Enter an offer price above 0, or leave it blank.'
    else if (price > 0 && offer > price) errors.new_price = "The offer price can’t be higher than the price."
  }
  if (!image) errors.image = 'Add a product image.'
  else if (!image.type.startsWith('image/')) errors.image = 'Choose an image file (PNG, JPG, WebP or AVIF).'

  return errors
}
