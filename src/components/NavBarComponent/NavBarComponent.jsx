import React, { useState } from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'

const NavBarComponent = () => {
    const onChange = () => {
        console.log('checked = ');
      };
    const [value, setValue] = useState(3);
    const renderContent = (type, options) => {
        switch(type){
            case 'text':
                return options.map((option) =>{
                    return <WrapperTextValue>
                        {option}
                    </WrapperTextValue>
                })
            case 'checkbox':
                return  <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px'}} onChange={onChange}>
                            {options.map((option) => {
                                return <Checkbox value={option.value}>{option.label}</Checkbox>    
                            })}
                        </Checkbox.Group>
            case 'rate':
                return <span>
                <Rate tooltips={options} onChange={setValue} value={value} />
                {value && <span style={{marginLeft: '15px'}}>{options[value - 1]}</span> }
              </span>
            case 'price':
                return options.map((option) => {
                    return (
                        <div style={{borderRadius: '10px ', color: 'rgb(56, 56, 61)', padding: '4px', width: 'fit-content', backgroundColor: 'rgb(238, 238, 238)' }}>{option}</div>
                    )})
            default:
                return {}
        }
    }
  return (
    <div style={{backgroundColor: '#fff', width: 'fit-content'}}>
        <WrapperLabelText>
            Label
        </WrapperLabelText>
        <WrapperContent>
            {renderContent('text', ['Tu lanh', 'Tivi', 'May giat'])}    
        </WrapperContent>
        <WrapperContent>
            {renderContent('checkbox', [
                {value: '1', label: 'A'},
                {value: '2', label: 'B'}
            ])}
        </WrapperContent>
        {/* <WrapperContent>
            {renderContent('rate', ['terrible', 'bad', 'normal', 'good', 'wonderful'])}
        </WrapperContent>
        <WrapperContent>
            {renderContent('price', ['duoi 40.000', 'tren 50.000'])}
        </WrapperContent> */}
    </div>
  )
}

export default NavBarComponent