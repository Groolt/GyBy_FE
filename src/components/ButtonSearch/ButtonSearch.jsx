import { Button } from 'antd'
import React from 'react'

const ButtonSearch = ({size, styleButton, styleTextButton, textButton, disabled, ...rest}) => {
  return (
    <Button
            size= {size}
            style={{
                ...styleButton,
              background: disabled ? '#ccc': styleButton.background
              }} 
            {...rest}
            ><span style={styleTextButton}> {textButton} </span>
    </Button>
  )
}

export default ButtonSearch