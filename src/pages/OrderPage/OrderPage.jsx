import { Form, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDelivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import ButtonSearch from '../../components/ButtonSearch/ButtonSearch';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { WrapperButtonQuality, WrapperQuality } from '../../components/ProductDetailComponent/style';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlice';
import { convertPrice } from '../../utils';
import InputSearch from '../../components/InputSearch/InputSearch';
import Loading from '../../components/LoadingComponent/Loading';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import { updateUser } from '../../redux/slices/userSlice';
import StepComponent from '../../components/StepComponent/StepComponent';
const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [listChecked, setListChecked] = useState([])
  const navigate = useNavigate()
  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (cur.price * (totalDiscount  * cur.amount) / 100)
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const deliveryPriceMemo = useMemo(() => {
    if(priceMemo >= 200000 && priceMemo < 500000){
      return 10000
    }else if(priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
      return 0
    } else {
      return 20000
    }
  },[priceMemo])
  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, deliveryPriceMemo])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }
  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  },[listChecked])
  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm();
  const handleChangeCount = (type, idProduct, limit) => {
    if(!limit) {
      if(type === 'increase') {
        dispatch(increaseAmount({idProduct}))
    }else {
        dispatch(decreaseAmount({idProduct}))
    }
    }
  }
  const handleDeleteAll = () => {
    if(listChecked?.length > 0){
      dispatch(removeAllOrderProduct({listChecked}))
      setListChecked([])
    }
  }
  const handleDeleteOrder = (idProduct) => {
    const newListChecked = listChecked.filter((item) => item !== idProduct)
    dispatch(removeOrderProduct({idProduct}))
    setListChecked(newListChecked)
  }
  const handleAddCart = () => {
    if(!order?.orderItemsSlected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    }else if(!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    }else {
      navigate('/payment')
    } 
  }
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id, token, { ...rests })
      return res
    },
  )

  const {isLoading} = mutationUpdate

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    setIsOpenModalUpdateInfo(false)
  }
  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: 'Free ship',
      description : 'Trên 500.000 VND',
    },
  ]
  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?._id, token: user?.accessToken, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name,address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }
  useEffect(() => {
    if(!isOpenModalUpdateInfo) return;
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold', marginTop: '0px', paddingTop: '9px'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <h4 >Phí giao hàng</h4>
            <WrapperStyleHeaderDelivery>
              <StepComponent items={itemsDelivery} current={deliveryPriceMemo === 10000 
                ? 2 : (deliveryPriceMemo === 20000 ? 1 
                : (order.orderItemsSlected.length === 0 ? 0: 3))}/>
            </WrapperStyleHeaderDelivery>
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={(listChecked?.length === order?.orderItems?.length) && listChecked.length !== 0}></CustomCheckbox>
                  <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick = {handleDeleteAll} />
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: '10px'}}> 
                      <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                      <img alt={order?.product} src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                      <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace:'nowrap'
                      }}>{order?.name}</div>
                    </div>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                      </span>
                      <WrapperQuality>
                        <WrapperButtonQuality style={{borderRight: 'none'}} onClick={() => handleChangeCount('decrease', order?.product,  order?.amount <= 1)}>
                          <MinusOutlined></MinusOutlined>
                        </WrapperButtonQuality>
                        <input disabled className="input" value={order?.amount} style={{width: '40px', border: '1px solid rgb(236, 236, 236)',  textAlign: 'center'}}/>
                        <WrapperButtonQuality style={{borderLeft: 'none'}}onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInstock)}>
                          <PlusOutlined></PlusOutlined>
                        </WrapperButtonQuality>
                      </WrapperQuality>
                      <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.amount*order?.price)}</span>
                      <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
                    </div>
                  </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{fontWeight: 'bold'}}>{ `${user?.address}, ${user?.city}`} </span>
                  <span onClick = {handleChangeAddress} style={{color: '#9255FD', cursor:'pointer', marginLeft: '5px'}}>Thay đổi</span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonSearch
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textButton={'Mua hàng'}
              onClick={() => handleAddCart()}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonSearch>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
        <Loading isLoading={isLoading}>
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputSearch value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <InputSearch value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputSearch value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputSearch value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default OrderPage