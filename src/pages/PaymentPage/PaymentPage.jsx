import { Form, Radio, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import { updateUser } from '../../redux/slices/userSlice'
import Loading from '../../components/LoadingComponent/Loading'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style'
import { convertPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputSearch from '../../components/InputSearch/InputSearch'
import ButtonSearch from '../../components/ButtonSearch/ButtonSearch'
import { removeAllOrderProduct } from '../../redux/slices/orderSlice'
import { PayPalButton } from "react-paypal-button-v2";


const PaymentPage = () => {
 const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady , setSdkReady] = useState(false)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [formEdit] = Form.useForm();
  const dispatch = useDispatch()

  useEffect(() => {
    if(!isOpenModalUpdateInfo) return;
    formEdit.setFieldsValue(stateUserDetails)
  }, [formEdit, stateUserDetails])

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
  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?._id, token: user?.accessToken, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }
  const addPaypalScript = async () => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=AekXTgEBiPqjoX-Zmn2cixNqpnWxxaJbX2uk0RhszhPecJP8J8MBMbrvnEO0bNt59sBQ_flm1gj8Bv4w`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }
  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  //order
  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )
  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      { 
        token: user?.accessToken, 
        orderItems: order?.orderItemsSlected, 
        fullName: user?.name,
        address:user?.address, 
        phone:user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?._id,
        email: user?.email,
        isPaid :true,
        paidAt: details.update_time,    
      }
    )
  }
  const {data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder
  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemsSlected?.forEach(element => {
        arrayOrdered.push(element.product)
      });
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
      navigate('/ordersuccess', {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSlected,
          totalPriceMemo: totalPriceMemo
        }
      })
      message.success('Đặt hàng thành công')
    } else if (isError) {
      message.error('Đặt hàng thất bại. Vui lòng thử lại')
    }
  }, [isSuccess,isError])

  const handleAddOrder = () => {
    if(user?.accessToken && order?.orderItemsSlected && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?._id) {
        mutationAddOrder.mutate(
          { 
            token: user?.accessToken, 
            orderItems: order?.orderItemsSlected, 
            fullName: user?.name,
            address:user?.address, 
            phone:user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?._id,
            email: user?.email
          }
        )
      }
  }
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3>Thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDelivery} value={delivery}> 
                    <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{width: '100%'}}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
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
              {payment === 'paypal' && sdkReady ? (
                <div style={{width: '320px'}}>
                  <PayPalButton
                    amount={Math.round(totalPriceMemo / 30000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert('Error')
                    }}
                  />
                </div>
              ) : (
                <ButtonSearch
                  onClick={handleAddOrder}
                  size={40}
                  styleButton={{
                      background: 'rgb(255, 57, 69)',
                      height: '48px',
                      width: '360px',
                      border: 'none',
                      borderRadius: '4px'
                  }}
                  textButton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonSearch>
              )}
   
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
            form={formEdit}
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
      </Loading>
    </div>
  )
}

export default PaymentPage