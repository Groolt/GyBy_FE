import React, { useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import Loading from '../../components/LoadingComponent/Loading'
const HomePage = () => {
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  const {data: typeProduct} = useQuery(['typeproduct'], fetchAllTypeProduct)
  const searchProduct = useSelector(state => state.product?.search)
  const [limit, setLimit] = useState(6)
  const searchDebounce = useDebounce(searchProduct, 500)
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }
  const { isLoading, data: products } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })
  return (
    <Loading isLoading={isLoading}>
      <div style={{padding: '0 120px'}}>
      <WrapperTypeProduct>
        {typeProduct?.data.map((item) => {
          return <TypeProduct key = {item } name = {item}/>
        })}
      </WrapperTypeProduct>
    </div>
     <div id='container' style={{background: '#efefef', padding: '0 120px', height: '100%'}}>
        <SliderComponent arrImgs = {[slider1, slider2, slider3]}/>
        <div>
          <WrapperProduct>
            {products?.data.map((product) => {
              return (
                <CardComponent key = {product._id} countInStock = {product.countInStock} description = {product.description}
                image = {product.image} name = {product.name} price = {product.price} rating={product.rating} selled = {product.selled}
                type={product.type} id ={product._id} discount={product.discount} />
              )
            })}
          </WrapperProduct>
        </div>
          <div style={{width: '100%', display: 'flex', marginTop: '10px', justifyContent: 'center'}}>
          {!(products?.totalPage === 1) && 
          ( <WrapperButtonMore textButton='Xem thêm' type= 'outline' 
          styleButton= {{width: '240px', height: '38px', borderRadius: '4px', margin: '20px 0px 40px 0px',
          border: '1px solid rgb(11, 116, 229)', color: 'rgb(11, 116, 229)'}}
          styleTextButton={{fontWeight: 500}}
          onClick={() =>  setLimit((prev) => prev + 6)}></WrapperButtonMore>)}
           
        </div>
        
   </div>
    </Loading>
  )
}
export default HomePage