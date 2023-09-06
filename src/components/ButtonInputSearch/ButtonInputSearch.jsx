import React from 'react'
import {SearchOutlined} from '@ant-design/icons';
import InputSearch from '../InputSearch/InputSearch';
import ButtonSearch from '../ButtonSearch/ButtonSearch';
const ButtonInputSearch = (props) => {
    const {
        size, placeHolder, textButton, 
        bordered, backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13, 92, 182)',
        colorButton = '#fff'
        } = props
  return (
    <div style={{display: 'flex'}}>
        <InputSearch
            size= {size}
            placeholder= {placeHolder}
            bordered= {bordered}
            style={{backgroundColor: backgroundColorInput, borderRadius: '0px'}}
            {...props}>
        </InputSearch>
        <ButtonSearch
            size= {size}
            styleButton= {{background: backgroundColorButton, border: !bordered && 'none', borderRadius: '0px'}}
            textButton= {textButton}
            styleTextButton= {{color: colorButton}}
            icon= {<SearchOutlined  style={{color: colorButton}} ></SearchOutlined>}>
        </ButtonSearch>
    </div>
  )
}

export default ButtonInputSearch