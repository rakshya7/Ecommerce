// Run with: npm test
import test from 'node:test'
import assert from 'node:assert/strict'
import { discountOf, formatPrice, validateProduct } from './lib.js'

const image = { type: 'image/png' }
const valid = { name: 'Court Classic Low', old_price: '99', new_price: '74' }

test('a complete product has no errors', () => {
  assert.deepEqual(validateProduct(valid, image), {})
})

test('the offer price is optional', () => {
  assert.deepEqual(validateProduct({ ...valid, new_price: '' }, image), {})
})

test('name, price and image are required', () => {
  assert.deepEqual(Object.keys(validateProduct({ name: '  ', old_price: '', new_price: '' }, null)).sort(), [
    'image',
    'name',
    'old_price',
  ])
})

test('prices must be numbers above zero', () => {
  assert.ok(validateProduct({ ...valid, old_price: 'abc' }, image).old_price)
  assert.ok(validateProduct({ ...valid, old_price: '0' }, image).old_price)
  assert.ok(validateProduct({ ...valid, new_price: '-5' }, image).new_price)
})

test('the offer price cannot exceed the price', () => {
  assert.ok(validateProduct({ ...valid, new_price: '120' }, image).new_price)
  assert.equal(validateProduct({ ...valid, new_price: '99' }, image).new_price, undefined)
})

test('only image files are accepted', () => {
  assert.ok(validateProduct(valid, { type: 'video/mp4' }).image)
})

test('discount is a whole percentage, and zero without a real reduction', () => {
  assert.equal(discountOf({ new_price: 74, old_price: 99 }), 25)
  assert.equal(discountOf({ new_price: 55, old_price: 55 }), 0)
  assert.equal(discountOf({ new_price: 60, old_price: 50 }), 0)
})

test('prices drop the decimals only when they are whole', () => {
  assert.equal(formatPrice(85), 'NPR\u00a085')
  assert.equal(formatPrice(80.5), 'NPR\u00a080.50')
})
