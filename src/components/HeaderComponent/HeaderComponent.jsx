import React, { Fragment, useState } from 'react'
import { Badge, Col, Popover } from 'antd'
import { WrapperContentPopup, WrapperHeader, WrapperHearderAccount, WrapperTextHeader } from './style'
import {UserOutlined, CaretDownOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slices/userSlice';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slices/productSlice';
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const user = useSelector((state) => state?.user)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const order = useSelector((state) => state.order)
  const userAvatar = user?.avatar
  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
    setLoading(false)
}
  const handleonClick = () => {
    if(user?.accessToken) {
      navigate('/order')
    } else {
      navigate('/signin')
    }
  }
  const content = (
    <div style={{cursor: 'pointer'}} onClick={() => setOpen(!open)}>
      <WrapperContentPopup onClick={() => { navigate('/profile-user') }}>Thông tin người dùng</WrapperContentPopup>
      {user.isAdmin && (
        <WrapperContentPopup onClick={() => { navigate('/system/admin') }}>Quản lý hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => { navigate('/myorder', {state : {
          id: user?._id,
          token : user?.accessToken
        }
      })}}>Lịch sử mua hàng</WrapperContentPopup>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const handleNavigateLogin = () => {
    navigate('/signin')
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div>
        <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
      <Col span={5}>
        <WrapperTextHeader style={{cursor: 'pointer'}} onClick={() => { navigate('/') }}>G Y C A & B Y C E</WrapperTextHeader>
      </Col>
      {!isHiddenSearch && (<Col span={12}>
        <ButtonInputSearch 
          placeHolder="Tìm sản phẩm, danh mục hay thương hiệu mong muốn"
          size="medium"
          bordered= {false}
          textButton= 'Tìm kiếm'
          onChange={onSearch}
        />
      </Col>)}
      <Col span={7}>
        <Loading isLoading = {loading}>
        <WrapperHearderAccount>
        {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
          {user?.accessToken ?(
            <Fragment>
              <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
                <div style={{cursor: 'pointer' , whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                , width: '150px' }}>{user.name || user.email || 'User'}</div>
              </Popover>
            </Fragment>
            
          ): (
            <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
              <div> Đăng nhập/Đăng ký</div>
              <div> 
                <span>Tài khoản</span>
                <CaretDownOutlined style={{paddingLeft: 5}}></CaretDownOutlined>
              </div>
            </div>
          )}    
          {!isHiddenCart && (<div style={{cursor:'pointer'}} onClick={handleonClick}>
            <Badge count= {user?.accessToken? order?.orderItems?.length : 0} size= 'small'>
              <ShoppingCartOutlined style={{
              fontSize: '30px',
              paddingLeft: 25,
              color: '#fff'    
              }}/>
            </Badge>
            <span style={{
              paddingLeft: 5
            }}>Giỏ hàng</span>
          </div>)}
        </WrapperHearderAccount> 
        </Loading>
      </Col>
    </WrapperHeader>
    </div>
  )
}

export default HeaderComponent