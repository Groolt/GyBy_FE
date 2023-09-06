import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const {id} = useParams()
  return (
    <div style={{padding: '0 120px', background: '#efefef', height: '100vh'}}>
        <h3 style={{marginTop: '0px', paddingTop: '5px'}}>Trang chủ - Chi tiết sản phẩm</h3>
        <ProductDetailComponent idProduct ={id}/>
    </div>
  )
}

export default ProductDetailPage