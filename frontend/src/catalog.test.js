import { SORTS, discountOf, formatPrice } from "./catalog";

test("discount is a whole percentage, and zero without a real reduction", () => {
  expect(discountOf({ new_price: 74, old_price: 99 })).toBe(25);
  expect(discountOf({ new_price: 55, old_price: 55 })).toBe(0);
  expect(discountOf({ new_price: 60, old_price: 50 })).toBe(0);
});

test("prices drop the decimals only when they are whole", () => {
  expect(formatPrice(85)).toBe("NPR\u00a085");
  expect(formatPrice(80.5)).toBe("NPR\u00a080.50");
});

test("sorts order products as labelled", () => {
  const products = [
    { id: 1, new_price: 90, old_price: 100, date: "2026-01-01" },
    { id: 2, new_price: 50, old_price: 100, date: "2026-03-01" },
    { id: 3, new_price: 70, old_price: 70, date: "2026-02-01" },
  ];
  const ids = (key) => [...products].sort(SORTS[key].compare).map((p) => p.id);

  expect(ids("newest")).toEqual([2, 3, 1]);
  expect(ids("price-asc")).toEqual([2, 3, 1]);
  expect(ids("price-desc")).toEqual([1, 3, 2]);
  expect(ids("discount")).toEqual([2, 1, 3]);
  expect(SORTS.featured.compare).toBeUndefined();
});
