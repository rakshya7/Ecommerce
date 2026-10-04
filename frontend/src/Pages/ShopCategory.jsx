import React, { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item, { ItemGridSkeleton } from "../Components/Item/Item";
import EmptyState, { LoadError } from "../Components/EmptyState/EmptyState";
import { CATEGORIES, SORTS } from "../catalog";

const ShopCategory = (props) => {
  const { all_product, productsStatus } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = CATEGORIES.find((c) => c.key === props.category);
  // The sort lives in the URL (?sort=discount) so a sorted view can be linked to.
  const sort = SORTS[searchParams.get("sort")] ? searchParams.get("sort") : "featured";

  const products = all_product.filter((item) => item.category === props.category);
  if (SORTS[sort].compare) products.sort(SORTS[sort].compare);

  return (
    <div className="container shop-category">
      <div className="shop-category-head">
        <div>
          <h1 className="page-title display">{category.title}</h1>
          {productsStatus === "ready" && products.length > 0 && (
            <p className="shop-category-count">
              {products.length} {products.length === 1 ? "style" : "styles"}
            </p>
          )}
        </div>

        {products.length > 1 && (
          <div className="shop-category-sort">
            <label htmlFor="sort" className="label">
              Sort by
            </label>
            <select
              id="sort"
              className="select"
              value={sort}
              onChange={(e) =>
                setSearchParams(e.target.value === "featured" ? {} : { sort: e.target.value }, { replace: true })
              }
            >
              {Object.entries(SORTS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {productsStatus === "loading" && <ItemGridSkeleton count={8} />}
      {productsStatus === "error" && <LoadError heading="h2" />}
      {productsStatus === "ready" && products.length === 0 && (
        <EmptyState
          heading="h2"
          title={`No ${category.title.toLowerCase()} yet`}
          text="Nothing is listed here right now. Have a look at the other ranges."
        >
          {CATEGORIES.filter((c) => c.key !== props.category).map((c) => (
            <Link key={c.key} to={c.path} className="btn btn--secondary">
              Shop {c.label.toLowerCase()}
            </Link>
          ))}
        </EmptyState>
      )}

      {products.length > 0 && (
        <div className="product-grid">
          {products.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopCategory;
