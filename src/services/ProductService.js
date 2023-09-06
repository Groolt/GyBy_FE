import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async(search ='', limit) => {
    let res = {}
    if(search.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-product?filter=${search}&limit=${limit}`)
    } else{
        if(limit) {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-product?limit=${limit}`)
        } else {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-product`)
        }
        
    }
    return res.data
}
export const getProductType = async (type, limit, page) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-product?limit=${limit}&page=${page}&filterby=type&filter=${type}`)
        return res.data
    }
}
export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create-product`, data)
    return res.data
}
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getdetail-product/${id}`)
    return res.data
}
export const updateProduct = async (id, accessToken, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update-product/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, accessToken) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-product/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`,
        }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token,) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-products`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-type`)
    return res.data
}