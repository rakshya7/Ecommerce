import './AddProduct.css'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icon/Icon'
import { API, CATEGORIES, validateProduct } from '../../lib'

const emptyProduct = {
    name:'',
    image:'',
    category:'women',
    new_price:'',
    old_price:''
}

const AddProduct = () => {
    const [image,setImage]=useState(null)
    const [productDetails,setProductDetails]=useState(emptyProduct)
    const [errors,setErrors]=useState({})
    const [saving,setSaving]=useState(false)
    const [notice,setNotice]=useState(null)
    const fileRef=useRef(null)

    // one object URL per chosen file, released when it changes
    const preview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image])
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const imageHandler =(e)=>{
        setImage(e.target.files[0] || null)
        setErrors((current) => ({ ...current, image: undefined }))
    }
    const changeHandler=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
        setErrors((current) => ({ ...current, [e.target.name]: undefined }))
    }
    const clearImage=()=>{
        setImage(null)
        fileRef.current.value=''
    }

const Add_Product=async(e)=>{
    e.preventDefault()
    setNotice(null)

    const found=validateProduct(productDetails,image)
    setErrors(found)
    if(Object.keys(found).length>0) return

    setSaving(true)
    try {
        let formData=new FormData()
        formData.append('product',image)

        const uploaded=await fetch(`${API}/upload`,{
            method:'POST',
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((resp)=>resp.json())
        if(!uploaded.success) throw new Error('Image upload failed')

        // a blank offer price means the product sells at its regular price
        const product={
            ...productDetails,
            image:uploaded.image_url,
            new_price:productDetails.new_price || productDetails.old_price,
        }
        const saved=await fetch(`${API}/addproduct`,{
            method:'POST',
            headers:{
                Accept:'application/json',
                "Content-Type":'application/json',
            },
            body:JSON.stringify(product),
        }).then((resp)=>resp.json())
        if(!saved.success) throw new Error('Product was not saved')

        setNotice({ type:'success', name:product.name })
        setProductDetails(emptyProduct)
        clearImage()
    } catch (error) {
        console.error('Failed to add product:', error)
        setNotice({ type:'error' })
    } finally {
        setSaving(false)
    }
}

  return (
    <div className='add-product'>
      <Link to='/listproduct' className='add-product-back'>
        <Icon name='back' size={16} />
        Products
      </Link>
      <div className='page-head'>
        <h1 className='page-title'>Add product</h1>
      </div>

      {notice?.type === 'success' && (
        <div className='notice notice--success' role='status'>
          <Icon name='check' />
          <p className='notice-text'>
            Added “{notice.name}” to the store. <Link to='/listproduct'>View products</Link>
          </p>
        </div>
      )}
      {notice?.type === 'error' && (
        <div className='notice notice--error' role='alert'>
          <Icon name='alert' />
          <p className='notice-text'>
            The product wasn’t added. Check that the API is running at {API}, then try again.
          </p>
        </div>
      )}

      <form className='panel add-product-form' onSubmit={Add_Product} noValidate>
        <div className='add-product-fields'>
          <div className="field">
            <label htmlFor='name' className='label'>Product name</label>
            <input
              id='name'
              className='input'
              value={productDetails.name}
              onChange={changeHandler}
              type="text"
              name='name'
              autoComplete='off'
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id='name-error' className='field-error'>{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor='category' className='label'>Category</label>
            <select id='category' value={productDetails.category} onChange={changeHandler} name="category" className='select add-product-category'>
              {CATEGORIES.map((category) => (
                <option key={category.key} value={category.key}>{category.label}</option>
              ))}
            </select>
          </div>

          <div className="add-product-prices">
            <div className="field">
              <label htmlFor='old_price' className='label'>Price</label>
              <input
                id='old_price'
                className='input'
                value={productDetails.old_price}
                onChange={changeHandler}
                type="text"
                inputMode='decimal'
                name='old_price'
                placeholder='0.00'
                autoComplete='off'
                aria-invalid={Boolean(errors.old_price)}
                aria-describedby={errors.old_price ? 'old_price-error' : undefined}
              />
              {errors.old_price && <p id='old_price-error' className='field-error'>{errors.old_price}</p>}
            </div>
            <div className="field">
              <label htmlFor='new_price' className='label'>
                Offer price <span className='label-note'>(optional)</span>
              </label>
              <input
                id='new_price'
                className='input'
                value={productDetails.new_price}
                onChange={changeHandler}
                type="text"
                inputMode='decimal'
                name='new_price'
                placeholder='0.00'
                autoComplete='off'
                aria-invalid={Boolean(errors.new_price)}
                aria-describedby={errors.new_price ? 'new_price-error' : 'new_price-hint'}
              />
              {errors.new_price
                ? <p id='new_price-error' className='field-error'>{errors.new_price}</p>
                : <p id='new_price-hint' className='hint'>Shown as the sale price, with the price above struck through.</p>}
            </div>
          </div>
        </div>

        <div className="field add-product-image">
          <label htmlFor="file-input" className='label'>Product image</label>
          {/* The file input covers the whole tile, so click, keyboard and drag-and-drop all work natively. */}
          <div className={`dropzone${errors.image ? ' dropzone--invalid' : ''}`}>
            {preview ? (
              <img src={preview} alt='Preview of the selected product image' />
            ) : (
              <div className='dropzone-empty'>
                <Icon name='upload' size={22} />
                <p><strong>Choose an image</strong> or drop it here</p>
              </div>
            )}
            <input
              ref={fileRef}
              onChange={imageHandler}
              type="file"
              name='image'
              id='file-input'
              accept='image/*'
              aria-describedby={errors.image ? 'image-error' : 'image-hint'}
            />
          </div>
          {errors.image && <p id='image-error' className='field-error'>{errors.image}</p>}
          {preview ? (
            <div className='add-product-image-foot'>
              <p id='image-hint' className='hint'>This is how it appears in the store.</p>
              <button type='button' className='link add-product-remove' onClick={clearImage}>Remove</button>
            </div>
          ) : (
            <p id='image-hint' className='hint'>A square photo on a plain background works best.</p>
          )}
        </div>

        <div className='add-product-actions'>
          <button type='submit' className='btn btn--primary' disabled={saving}>
            {saving ? 'Adding…' : 'Add product'}
          </button>
          <Link to='/listproduct' className='btn btn--secondary'>Cancel</Link>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
