import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonSearch from '../../components/ButtonSearch/ButtonSearch'
import { useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { UploadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd'
import { getBase64 } from '../../utils'
const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const {id, accessToken,...rest } = data
            return UserService.updateUser(id, accessToken, {...rest})
        }
    )
    const {isLoading, isSuccess, isError} = mutation
    useEffect(() => {
        if(isSuccess) {
            message.success('Update Successfully', 1.5,window.location.reload())
        } else if(isError){
          message.error()
        }
      }, [isSuccess, isError])
    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }
    const handleUpdate = () => {
        mutation.mutate({email, name, phone, address, avatar, id: user?._id, accessToken: user?.accessToken})
    }
  return (
    <div style={{width: '1270px', margin:'0 auto', height: '500px'}}>
        <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <Loading isLoading={isLoading}>
            <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLabel htmlFor='name'>Name</WrapperLabel>
                    <InputForm id = 'name' style = {{marginBottom: '0px'}} value = {name} onChange = {handleOnchangeName}/>
                    <ButtonSearch
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonSearch>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                    <InputForm id = 'email' style = {{marginBottom: '0px'}} value = {email} onChange = {handleOnchangeEmail}/>
                    <ButtonSearch
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonSearch>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>
                    <InputForm id = 'phone' style = {{marginBottom: '0px'}} value = {phone} onChange = {handleOnchangePhone}/>
                    <ButtonSearch
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonSearch>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='address'>Address</WrapperLabel>
                    <InputForm id = 'address' style = {{marginBottom: '0px'}} value = {address} onChange = {handleOnchangeAddress}/>
                    <ButtonSearch
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonSearch>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel>Avatar</WrapperLabel>
                    <WrapperUploadFile onChange = {handleOnchangeAvatar} maxCount= {1}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </WrapperUploadFile>
                    {avatar && (
                        <img src={avatar} style={{
                            height: '60px',
                            width: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} alt="avatar"/>
                    )}
                    <ButtonSearch
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonSearch>
                </WrapperInput>
            </WrapperContentProfile>
        </Loading>
    </div>
  )
}

export default ProfilePage