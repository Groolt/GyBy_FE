import { Input } from 'antd'
import React from 'react'

const InputSearch = ({size, placeHolder, bordered, style, ...rests}) => {
  return (
        <Input
            size= {size}
            placeholder= {placeHolder}
            bordered= {bordered}
            style= {style}

            {...rests}>
        </Input>
  )
}

export default InputSearch