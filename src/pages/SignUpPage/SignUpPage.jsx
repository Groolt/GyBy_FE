/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperInput, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonSearch from '../../components/ButtonSearch/ButtonSearch'
import { Image } from 'antd'
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()
  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
  )
  const {data, isLoading, isSuccess, isError} = mutation
  useEffect(() => {
    if(isSuccess) {
      message.success()
      handleNavigateLogin()
    } else if(isError){
      message.error()
    }
  }, [isSuccess, isError])
  const handleNavigateLogin = () => {
    navigate('/signin')
  }
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleSignUp= () => {
    mutation.mutate({
      email,
      password,
      confirmPassword
    })
  }
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent:'center', height: '100vh', background: 'rgba(0, 0, 0, 0.53)'}}>
      <div style={{width:'800px', height: '445px', borderRadius: '20px', background: '#fff',display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Nhập email và mật khẩu tài khoản Tiki</p> 
          <InputForm placeholder ="Tên tài khoản" value = {email} onChange = {handleOnchangeEmail}/>
          <WrapperInput
             placeholder="Mật khẩu"
             value = {password} onChange = {(e) => setPassword(e.target.value)}    
            />
          <WrapperInput
             placeholder="Xác nhận mật khẩu"
             value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)}    
            />
          {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
            <ButtonSearch    
              disabled = {!email.length || !password.length || !confirmPassword.length} 
              onClick={handleSignUp}
              styleButton= {{background: 'rgb(255, 57, 69)', border: 'none', borderRadius: '4px', 
              height: '48px', width: '100%', margin: '12px 0px 6px'}}
              textButton= {'Đăng ký'}
              styleTextButton= {{color: '#fff', fontSize: '20px', fontWeight: 500}}>
            </ButtonSearch>
          </Loading>
          <p style={{color: 'rgb(13, 92, 182)', fontSize: '15px', margin: '20px 0px 0px'}}>Quên mật khẩu?</p>
          <WrapperText>
            Bạn đã có tài khoản? 
            <span className='dn' onClick={handleNavigateLogin}>
               Đăng nhập
            </span>
          </WrapperText>       
        </WrapperContainerLeft>
        <WrapperContainerRight>
            <Image src={logo} alt ='logo' preview= {false} style={{width: '203px', height: '203px'}}/>
            <div style={{    margin: '30px 0px 0px', textAlign: 'center'}}>
              <h4 style={{margin: '0px 0px 5px', color: 'rgb(11, 116, 229)', fontSize: '18px', fontWeight: 800}}>Mua sắm tại GyBy</h4>
              <span style={{fontSize: '14px', color: 'rgb(11, 116, 229)', fontWeight: 500}}>Siêu ưu đãi mỗi ngày</span>
            </div>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage