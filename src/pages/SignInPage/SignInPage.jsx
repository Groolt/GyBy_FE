/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperInput, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonSearch from '../../components/ButtonSearch/ButtonSearch'
import { Image } from 'antd'
import logo from '../../assets/images/logo.png'
import {useLocation, useNavigate} from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import jwt_decode from "jwt-decode"
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slices/userSlice'

const SignInPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {state} = useLocation()
    const dispatch = useDispatch()
    const mutation = useMutationHooks(
      data => UserService.loginUser(data)
    )
    const {data, isLoading, isSuccess} = mutation
    useEffect(() => {
      if(isSuccess) {
        if(state) {
          navigate(state)
        } else {
          navigate('/')
        }
        localStorage.setItem('accessToken', JSON.stringify(data?.accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(data?.refreshToken))          
        if(data?.accessToken){
          const decode = jwt_decode(data?.accessToken)
          if(decode?.id) {
            handleGetDetailUser(decode.id, data.accessToken)
          }
        }   
      } 
    }, [isSuccess])
    const handleGetDetailUser = async (id, token) => {
      const storage = localStorage.getItem('refreshToken')
      const refreshToken = JSON.parse(storage)
      const res = await UserService.getDetailUser(id, token)
      dispatch(updateUser({...res?.data, accessToken: token, refreshToken}))
    }
    const handleNavigateSignup = () => {
      navigate('/signup')
    }
    const handleOnchangeEmail = (value) => {
      setEmail(value)
    }
    const handleSignIn = () => {
      mutation.mutate({
        email,
        password
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
          {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
            <ButtonSearch  
              disabled = {!email.length || !password.length} 
              onClick={handleSignIn}   
              styleButton= {{background: 'rgb(255, 57, 69)', border: 'none', borderRadius: '4px', 
              height: '48px', width: '100%', margin: '26px 0px 10px'}}
              textButton= {'Đăng nhập'}
              styleTextButton= {{color: '#fff', fontSize: '20px', fontWeight: 500}}>
            </ButtonSearch>
          </Loading>
          <p style={{color: 'rgb(13, 92, 182)', fontSize: '15px', margin: '20px 0px 0px', cursor: 'pointer'}}>Quên mật khẩu?</p>
          <WrapperText>
            Chưa có tài khoản? 
            <span className='dk' onClick={handleNavigateSignup}>
               Đăng ký
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

export default SignInPage