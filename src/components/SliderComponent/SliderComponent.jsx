import { Image } from 'antd'
import React from 'react'
import { WrapperSliderStyle } from './style'
const SliderComponent = ({arrImgs}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplayspeed: 100 
    }
  return (
    <WrapperSliderStyle  {...settings}>
        {arrImgs.map((img) => {
            return (
                <Image key = {img} src= {img} preview = {false} alt='slider' width= '100%' height = '100%'>

                </Image>
            )
        })}
    </WrapperSliderStyle>
  )
}

export default SliderComponent