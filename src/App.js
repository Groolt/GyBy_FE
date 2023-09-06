import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {routes} from './routes/index'
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { isJsonString } from './utils';
import jwt_decode from "jwt-decode"
import {useDispatch, useSelector} from 'react-redux'
import * as UserService from './services/UserService'
import { resetUser, updateUser } from './redux/slices/userSlice'

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  useEffect(() =>{
    const {decode, storageData} = handleDecoded()
    if(decode?.id) {
      handleGetDetailUser(decode?.id, storageData)
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage?.getItem('accessToken')
    let decode = {}
    if(storageData && isJsonString(storageData)){
      storageData = JSON.parse(storageData)
       decode = jwt_decode(storageData)
    }
    return {decode, storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decode } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refreshToken')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken =  jwt_decode(refreshToken)
    if (decode?.exp < currentTime.getTime() / 1000) {
      if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.accessToken}`
      }else {
        dispatch(resetUser())
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refreshToken')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, accessToken: token, refreshToken}))
  }
  return (
     <div>
      <Router>
        <Routes>
          {routes.map((route) => {
          const Layout = route.isShowHeader ? DefaultComponent : Fragment
          const checkout = !route.isPrivated || user.isAdmin
          const Page = route.element
          const path = checkout?route.path:'/null'
            return (
                <Route key = {route.path} path = {path} element = {
                <Layout>
                  <Page/>
                </Layout>
                }/>      
            )
          })}
        </Routes>
      </Router>
     </div>
  )
}
export default App;
