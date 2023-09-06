import { Card } from 'antd'
import React from 'react'
import { WrapperReviewText, StyleNameProduct, WrapperPriceText, WrapperDiscountText } from './style'
import { StarFilled } from '@ant-design/icons';
import logo from '../../assets/images/official.png'
import {useNavigate} from 'react-router-dom'
import { convertPrice } from '../../utils';
const CardComponent = (props) => {
    //countInStock, description, image, type, 
    const {  name, price, rating, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailProduct = () => {
        navigate(`/productdetail/${id}`)
    }
  return (
    <div onClick={handleDetailProduct}>
    <Card
        hoverable
        style={{ width: 200, position: 'relative'}}
        bodyStyle={{padding: '10px'}}
        cover={<img style={{ borderTopLeftRadius: '15px'}} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" 
       />}
    >
        <img alt= 'logo' src= {logo} preview= "false"
            style={{width: '72px', position: 'absolute', height: '20px', top: '-1px', left: '0px' }}/>
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReviewText>
            <span>
                {rating}
                <StarFilled style={{fontSize: '10px', color: 'yellow', margin: '3px' }}/>
            </span>
            <div style={{width: '1px', height: '9px', backgroundColor: 'rgb(199, 199, 199)', marginLeft: '3px'}}/>
            
            <span style={{paddingLeft: '6px'}}>Da ban {selled || 100}+</span>
        </WrapperReviewText>
        <WrapperPriceText>
        {convertPrice(price)}
            <WrapperDiscountText> -{discount || 5}%</WrapperDiscountText>
        </WrapperPriceText>
  </Card>
    </div>
    
  )
}

export default CardComponent