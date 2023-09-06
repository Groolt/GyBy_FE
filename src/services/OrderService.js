import { axiosJWT } from "./UserService"

export const createOrder = async (data, accessToken) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
      headers: {
          token: `Bearer ${accessToken}`,
      }
  })
  return res.data
}
export const getOrderByUserId = async (id,accessToken) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
      headers: {
          token: `Bearer ${accessToken}`,
      }
  })
  return res.data
}

export const getDetailsOrder = async (id,accessToken) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
      headers: {
          token: `Bearer ${accessToken}`,
      }
  })
  return res.data
}

export const cancelOrder = async (id, accessToken, orderItems, userId ) => {
  const data = {orderItems, orderId: id}
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}`, {data}, {
      headers: {
          token: `Bearer ${accessToken}`,
      }
  })
  return res.data
}

export const getAllOrder = async (accessToken) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
      headers: {
          token: `Bearer ${accessToken}`,
      }
  })
  return res.data
}