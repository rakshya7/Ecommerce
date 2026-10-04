import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Item, { ItemGridSkeleton } from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/popularinwomen')
      .then((response) => response.json())
      .then((data) => {
        setPopularProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching popular products:', error);
        setLoading(false);
      });
  }, []);

  // Nothing to show: the home page reports a failed load once, not per section.
  if (!loading && popularProducts.length === 0) return null;

  return (
    <section className='section container'>
      <div className='section-head'>
        <h2 className='section-title display'>Popular in women</h2>
        <Link to='/womens' className='link'>View all women’s shoes</Link>
      </div>

      {loading ? (
        <ItemGridSkeleton count={4} className='product-grid product-grid--even' />
      ) : (
        <div className='product-grid product-grid--even'>
          {popularProducts.map((item) => {
            return (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Popular;
