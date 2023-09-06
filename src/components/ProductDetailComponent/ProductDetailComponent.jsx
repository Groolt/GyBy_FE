import { Col, Image, Rate, Row } from 'antd'
import React, { useState } from 'react'
import productimgSmall from '../../assets/images/test.webp'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import ButtonSearch from '../ButtonSearch/ButtonSearch';
import * as ProductService from '../../services/ProductService'
import { WrapperAddressProduct, WrapperBrand, WrapperButtonQuality, WrapperImageSmall, WrapperPriceProduct, WrapperQuality, WrapperReviewText, WrapperStyleNameProduct, WrapperTextPriceProduct, WrapperTextQuality } from './style'
import { useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct } from '../../redux/slices/orderSlice';
import { convertPrice } from '../../utils';
const ProductDetailComponent = ({idProduct}) => {
  const [numProduct, setNumProduct] = useState(1)
  const location = useLocation()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if(id) {
        const res = await ProductService.getDetailsProduct(id)
        return res.data
    }
  }
const handleChangeCount = (type, limited) => {
  if(type === 'increase') {
      if(!limited) {
          setNumProduct(numProduct + 1)
      }
  }else {
      if(!limited) {
          setNumProduct(numProduct - 1)
      }
  }
}
const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, {enabled : !!idProduct})
const handleAddOrderProduct = () => {
  if(!user?._id) {
    navigate('/signin', {state: location?.pathname})
  } else {
    dispatch(addOrderProduct({
      orderItem: {
          name: productDetails?.name,
          amount: numProduct,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?._id,
          discount: productDetails?.discount,
          countInstock: productDetails?.countInStock
      }
  }))
  }
}

function roundHalf(num) {
  return Math.round(num*2)/2;
}
  return (
    <Loading isLoading={isLoading}>
      <Row style={{background: '#fff', padding: '16px'}} >
        <Col span={10}>
            <Image src= {productDetails?.image} alt= 'product' preview= {false} style={{width: '444px', height: '444px'}}/>
            <Row style={{paddingTop: '10px'}}>
                <WrapperImageSmall src= {productimgSmall} alt= 'productSmall' /> 
                <WrapperImageSmall src= {productimgSmall} alt= 'productSmall' /> 
                <WrapperImageSmall src= {productimgSmall} alt= 'productSmall' /> 
                <WrapperImageSmall src= {productimgSmall} alt= 'productSmall' /> 
                <WrapperImageSmall src= {productimgSmall} alt= 'productSmall' /> 
            </Row>
        </Col>
        <Col span={14}>
            <WrapperBrand>
              Tác giả: Lê Bảo Ngọc
            </WrapperBrand>
            <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
            <WrapperReviewText>
              <Rate disabled value={roundHalf(productDetails?.rating)} style={{fontSize: 16}}/>
              <span style={{paddingRight: '8px', paddingLeft: '8px'}}>(Xem 21 đánh giá)</span>
              <div style={{width: '1px', height: '12px', backgroundColor: 'rgb(199, 199, 199)', marginLeft: '3px'}}/>
              <span style={{paddingLeft: '8px'}}>Đã bán </span>
            </WrapperReviewText>
            <WrapperPriceProduct>
              <WrapperTextPriceProduct>{convertPrice(productDetails?.price)}</WrapperTextPriceProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
              <span>Giao đến </span>
              <span className="address">{user?.address}</span> -
              <span className="address-change"> Đổi địa chỉ</span>
            </WrapperAddressProduct>
            <div style={{ paddingBottom: '10px', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5'}}>
              <WrapperTextQuality>Số lượng</WrapperTextQuality>
              <WrapperQuality>
                  <WrapperButtonQuality style={{borderRight: 'none'}} onClick={() => handleChangeCount('decrease',numProduct <= 1)}>
                    <MinusOutlined></MinusOutlined>
                  </WrapperButtonQuality>
                  <input disabled className="input" value={numProduct} style={{width: '40px', border: '1px solid rgb(236, 236, 236)',  textAlign: 'center'}}/>
                  <WrapperButtonQuality style={{borderLeft: 'none'}} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
                    <PlusOutlined></PlusOutlined>
                  </WrapperButtonQuality>
              </WrapperQuality>
            </div>
           
            <div style={{marginTop: '16px'}}>
              <ButtonSearch     
                styleButton= {{background: 'rgb(255, 57, 69)', border: 'none', borderRadius: '4px', 
                height: '48px', width: '220px'}}
                textButton= {'Chọn mua'}
                styleTextButton= {{color: '#fff', fontSize: '15px', fontWeight: 500}}
                onClick={handleAddOrderProduct}> 
                </ButtonSearch>
               <ButtonSearch     
                styleButton= {{background: '#fff', borderRadius: '4px', height: '48px', width: '220px', marginLeft: '12px',
                border: '1px solid rgb(13, 92, 182)' }}
                textButton= {'Mua trước trả sau'}
                styleTextButton= {{color: 'rgb(13, 92, 182)', fontSize: '15px', fontWeight: 500}}>
                </ButtonSearch>
            </div>
        </Col>
    </Row>
    </Loading>
    
  )
}

export default ProductDetailComponent