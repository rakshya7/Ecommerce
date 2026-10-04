import './Listproduct.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icon/Icon'
import { API, STORE_URL, CATEGORIES, categoryLabel, formatPrice, discountOf } from '../../lib'

const SORTS = {
  newest: { label: 'Newest first', compare: (a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id },
  oldest: { label: 'Oldest first', compare: (a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id },
  name: { label: 'Name: A to Z', compare: (a, b) => a.name.localeCompare(b.name) },
  'price-asc': { label: 'Price: low to high', compare: (a, b) => a.new_price - b.new_price },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => b.new_price - a.new_price },
}

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

// Native <dialog>: focus trapping, Escape and the backdrop come with the platform.
const ConfirmDialog = ({ products, busy, onConfirm, onCancel }) => {
  const ref = useRef(null)
  const open = products !== null

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const one = products?.length === 1

  return (
    <dialog
      ref={ref}
      className='dialog'
      aria-labelledby='dialog-title'
      onCancel={(e) => { e.preventDefault(); if (!busy) onCancel() }}
      onClick={(e) => { if (e.target === ref.current && !busy) onCancel() }}
    >
      {/* the padding lives on this inner box, so a click on the <dialog> itself is a backdrop click */}
      {open && (
        <div className='dialog-body'>
          <h2 id='dialog-title' className='dialog-title'>
            {one ? `Remove “${products[0].name}”?` : `Remove ${products.length} products?`}
          </h2>
          <p className='dialog-text'>
            {one ? 'It' : 'They'} will disappear from the store straight away. This can’t be undone.
          </p>
          <div className='dialog-actions'>
            <button type='button' className='btn btn--secondary' onClick={onCancel} disabled={busy}>Cancel</button>
            <button type='button' className='btn btn--danger' onClick={onConfirm} disabled={busy}>
              {busy ? 'Removing…' : one ? 'Remove product' : `Remove ${products.length} products`}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}

const ListProduct = () => {
    const [allproducts,setAllProducts]=useState([])
    const [status,setStatus]=useState('loading') // 'loading' | 'ready' | 'error'
    const [category,setCategory]=useState('all')
    const [query,setQuery]=useState('')
    const [sort,setSort]=useState('newest')
    const [selected,setSelected]=useState(() => new Set())
    const [pending,setPending]=useState(null) // products awaiting confirmation
    const [removing,setRemoving]=useState(false)
    const [notice,setNotice]=useState(null)
    const selectAllRef=useRef(null)

const fetchInfo=useCallback(async()=>{
  try {
    const data = await fetch(`${API}/allproducts`).then((res) => res.json())
    if (!Array.isArray(data)) throw new Error('Unexpected products response')
    setAllProducts(data)
    setStatus('ready')
  } catch (error) {
    console.error('Failed to load products:', error)
    setStatus('error')
  }
},[])
useEffect(()=>{
    fetchInfo()
},[fetchInfo])

// One request per product, in turn: the API removes a single id per call.
const removeProducts=async()=>{
  setRemoving(true)
  try {
    for (const product of pending) {
      const res = await fetch(`${API}/removeproduct`,{
          method:'POST',
          headers:{
              Accept:'application/json',
              'Content-Type':'application/json'
          },
          body:JSON.stringify({id:product.id})
      })
      if (!res.ok) throw new Error(`Remove failed with status ${res.status}`)
    }
    setNotice({
      type:'success',
      text: pending.length === 1 ? `Removed “${pending[0].name}”.` : `Removed ${pending.length} products.`,
    })
  } catch (error) {
    console.error('Failed to remove products:', error)
    setNotice({ type:'error', text:"Some products couldn’t be removed. Check that the API is running and try again." })
  }
  setSelected(new Set())
  await fetchInfo()
  setRemoving(false)
  setPending(null)
}

    const term = query.trim().toLowerCase()
    const visible = allproducts
      .filter((product) => category === 'all' || product.category === category)
      .filter((product) => !term || product.name.toLowerCase().includes(term) || String(product.id) === term)
      .sort(SORTS[sort].compare)

    // Bulk actions only ever touch rows that are on screen.
    const selectedVisible = visible.filter((product) => selected.has(product.id))
    const allSelected = visible.length > 0 && selectedVisible.length === visible.length

    useEffect(() => {
      if (selectAllRef.current) {
        selectAllRef.current.indeterminate = selectedVisible.length > 0 && !allSelected
      }
    })

    const toggle = (id) => {
      const next = new Set(selected)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      setSelected(next)
    }

    const tabs = [{ key:'all', label:'All' }, ...CATEGORIES].map((tab) => ({
      ...tab,
      count: tab.key === 'all' ? allproducts.length : allproducts.filter((product) => product.category === tab.key).length,
    }))

    const filtered = category !== 'all' || term !== ''

  return (
    <div className='list-product'>
      <div className='page-head'>
        <div>
          <h1 className='page-title'>Products</h1>
          {status === 'ready' && (
            <p className='page-subtitle'>
              {allproducts.length} {allproducts.length === 1 ? 'product' : 'products'} in the store
            </p>
          )}
        </div>
        <Link to='/addproduct' className='btn btn--primary'>
          <Icon name='plus' />
          Add product
        </Link>
      </div>

      {notice && (
        <div className={`notice notice--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          <Icon name={notice.type === 'error' ? 'alert' : 'check'} />
          <p className='notice-text'>{notice.text}</p>
          <button type='button' className='icon-btn notice-dismiss' aria-label='Dismiss' onClick={() => setNotice(null)}>
            <Icon name='close' size={16} />
          </button>
        </div>
      )}

      <div className='panel'>
        <div className='listproduct-toolbar'>
          <div className='tabs' role='group' aria-label='Filter by category'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type='button'
                className='tab'
                aria-pressed={category === tab.key}
                onClick={() => setCategory(tab.key)}
              >
                {tab.label}
                {status === 'ready' && <span className='tab-count'>{tab.count}</span>}
              </button>
            ))}
          </div>

          <div className='listproduct-controls'>
            <div className='search'>
              <Icon name='search' size={16} />
              <input
                type='search'
                className='input'
                placeholder='Search by name or ID'
                aria-label='Search products by name or ID'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className='select listproduct-sort'
              aria-label='Sort products'
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {Object.entries(SORTS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedVisible.length > 0 && (
          <div className='bulkbar'>
            <p className='bulkbar-count'>{selectedVisible.length} selected</p>
            <button type='button' className='btn btn--secondary bulkbar-remove' onClick={() => setPending(selectedVisible)}>
              <Icon name='trash' size={16} />
              Remove
            </button>
            <button type='button' className='link bulkbar-clear' onClick={() => setSelected(new Set())}>
              Clear selection
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div aria-busy='true' aria-label='Loading products'>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className='listproduct-skeleton'>
                <div className='thumb skeleton' />
                <div className='skeleton listproduct-skeleton-line' />
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className='empty'>
            <h2 className='empty-title'>Couldn’t load products</h2>
            <p className='empty-text'>Check that the API is running at {API}, then try again.</p>
            <div className='empty-actions'>
              <button type='button' className='btn btn--secondary' onClick={() => { setStatus('loading'); fetchInfo() }}>
                Try again
              </button>
            </div>
          </div>
        )}

        {status === 'ready' && visible.length === 0 && (
          filtered ? (
            <div className='empty'>
              <h2 className='empty-title'>No products match</h2>
              <p className='empty-text'>Try a different search or category.</p>
              <div className='empty-actions'>
                <button type='button' className='btn btn--secondary' onClick={() => { setQuery(''); setCategory('all') }}>
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className='empty'>
              <h2 className='empty-title'>No products yet</h2>
              <p className='empty-text'>Products you add appear here and in the store.</p>
              <div className='empty-actions'>
                <Link to='/addproduct' className='btn btn--primary'>
                  <Icon name='plus' />
                  Add product
                </Link>
              </div>
            </div>
          )
        )}

        {status === 'ready' && visible.length > 0 && (
          <table className='table'>
            <thead>
              <tr>
                <th scope='col' className='col-check'>
                  <label className='select-all'>
                    <input
                      ref={selectAllRef}
                      type='checkbox'
                      checked={allSelected}
                      onChange={() => setSelected(allSelected ? new Set() : new Set(visible.map((product) => product.id)))}
                    />
                    <span className='select-all-label'>Select all</span>
                  </label>
                </th>
                <th scope='col'>Product</th>
                <th scope='col' className='col-category'>Category</th>
                <th scope='col' className='col-price'>Price</th>
                <th scope='col' className='col-added'>Added</th>
                <th scope='col' className='col-actions'><span className='visually-hidden'>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => {
                const discount = discountOf(product)
                return (
                  <tr key={product.id} className={selected.has(product.id) ? 'is-selected' : undefined}>
                    <td className='col-check'>
                      <input
                        type='checkbox'
                        aria-label={`Select ${product.name}`}
                        checked={selected.has(product.id)}
                        onChange={() => toggle(product.id)}
                      />
                    </td>
                    <td className='col-product'>
                      <div className='product-cell'>
                        <span className='thumb'>
                          <img src={product.image} alt='' loading='lazy' />
                        </span>
                        <div className='product-cell-text'>
                          <p className='product-cell-name'>{product.name}</p>
                          <p className='product-cell-meta'>
                            ID {product.id}
                            <span className='product-cell-category'> · {categoryLabel(product.category)}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='col-category'>{categoryLabel(product.category)}</td>
                    <td className='col-price'>
                      <p className='price-now'>{formatPrice(product.new_price)}</p>
                      {discount > 0 && (
                        <p className='price-was'>
                          <s><span className='visually-hidden'>Was </span>{formatPrice(product.old_price)}</s>
                          <span className='price-off'>−{discount}%</span>
                        </p>
                      )}
                    </td>
                    <td className='col-added'>{formatDate(product.date)}</td>
                    <td className='col-actions'>
                      <a
                        href={`${STORE_URL}/product/${product.id}`}
                        target='_blank'
                        rel='noreferrer'
                        className='icon-btn'
                        title='View in store'
                        aria-label={`View ${product.name} in store`}
                      >
                        <Icon name='external' />
                      </a>
                      <button
                        type='button'
                        className='icon-btn icon-btn--danger'
                        title='Remove'
                        aria-label={`Remove ${product.name}`}
                        onClick={() => setPending([product])}
                      >
                        <Icon name='trash' />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        products={pending}
        busy={removing}
        onConfirm={removeProducts}
        onCancel={() => setPending(null)}
      />
    </div>
  )
}

export default ListProduct
