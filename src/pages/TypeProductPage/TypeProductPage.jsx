import React, { useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import {Col, Pagination, Row } from 'antd'
import { WrapperNavBar, WrapperProduct } from './style'
import { useLocation } from 'react-router-dom'
import { useDebounce } from '../../hooks/useDebounce'
import { useSelector } from 'react-redux'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [products, setProducts] = useState([])
  const {state} = useLocation()
  const [isLoading, setLoading] = useState(false)
const [panigate, setPanigate] = useState({
    page: 1,
    limit: 8,
    total: 1,
})
const onChange = (current, pageSize) => {
    console.log(pageSize)
    setPanigate({...panigate, page: current})    
}
const fetchProductType = async (type, page, limit) => {
    setLoading(true)
    const res = await ProductService.getProductType(type, limit, page)
    if(res?.status === 'OK') {
        setLoading(false)
        setProducts(res?.data)
        setPanigate({...panigate, total: res?.totalProduct})
    }else {
        setLoading(false)
    }
}

useEffect(() => {
    if(state){
        fetchProductType(state, panigate.page, panigate.limit)
    }
}, [state ,panigate.page, panigate.limit])
return (
     <Loading isLoading={isLoading}>
            <div style={{ width: '100%', background: '#efefef', height: 'calc(110vh)' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px',height: 'calc(100% - 20px)' }}>
                        <WrapperNavBar span={4} >
                            <NavBarComponent />
                        </WrapperNavBar>
                        <Col span={20} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <WrapperProduct >
                                {products?.filter((pro) => {
                                    if(searchDebounce === '') {
                                        return pro
                                    }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                        return pro
                                    }
                                })?.map((product) => {
                                    return (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.selled}
                                            discount={product.discount}
                                            id={product._id}
                                        />
                                    )
                                })}
                            </WrapperProduct>
                            <Pagination defaultPageSize={panigate.limit}  defaultCurrent={panigate.page} total={panigate.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
  )
}

export default TypeProductPage