import React, { useEffect, useState } from 'react'
import Item, { ItemGridSkeleton } from '../Item/Item'

const NewCollection = () => {
  const [new_collection, setNew_collection] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
      .then((response) => response.json())
      .then((data) => {
        setNew_collection(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching new collections:', error)
        setLoading(false)
      })
  }, [])

  if (!loading && new_collection.length === 0) return null

  return (
    // the hero's "Shop new arrivals" button scrolls here
    <section className='section container' id='new-arrivals'>
      <div className='section-head'>
        <h2 className='section-title display'>New arrivals</h2>
      </div>

      {loading ? (
        <ItemGridSkeleton count={8} className='product-grid product-grid--even' />
      ) : (
        <div className='product-grid product-grid--even'>
          {new_collection.map((item) => {
            return (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                category={item.category}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export default NewCollection
