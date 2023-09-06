/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { Button, Form, Input, Space, message } from 'antd'
import { UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import InputSearch from '../InputSearch/InputSearch'
import { getBase64 } from '../../utils'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { useForm } from 'antd/es/form/Form'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import Highlighter from "react-highlight-words" 
const AdminUser = () => {
     //Search on table
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
  const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
  const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
  const user = useSelector((state => state?.user))
  const [rowSelected, setRowSelected] = useState('')
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer', marginLeft: '5px' }} onClick={handleEditUser} />
      </div>
    )
  }
  const inittial = () => ({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  })
  const fetchUserAll = async () => {
    const res = await UserService.getAllUser(user?.accessToken)
    return res
  }
  const queryUsers = useQuery(['Users'], fetchUserAll)
  const { isLoading: isLoadingUsers, data: Users } = queryUsers 
  const dataTable = Users?.data?.length && Users?.data?.map((User) => {
    return { ...User, key: User._id }
  })
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'isAdmin',
      dataIndex: 'isAdmin',
      render: (text) => text?'True':'False',
      filters: [
        {
          text: 'True',
          value: true,
        },
        {
          text: 'False',
          value: false,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value) {
          return record.isAdmin
        }
        return !record.isAdmin
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  // const handleChangeSelect = (value) => {
  //   setStateUser({
  //     ...stateUser,
  //     type: value
  //   })
  // }

  //Edit
  const fetchGetDetailsUser = async (rowSelected) => {
    setStateUserDetails(inittial())
    const res = await UserService.getDetailUser(rowSelected)
    if (res?.data) {
      setStateUserDetails(res.data)
      console.log(stateUserDetails)
    }
  }
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [formEdit] = useForm()
  const [stateUserDetails, setStateUserDetails] = useState(inittial())
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        token,
        {...rests} )
      return res
    },
  )
  const{data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate} = mutationUpdate
  useEffect(() =>{
    if(isSuccessUpdate && dataUpdate?.status === 'OK'){
      message.success('Edit User Successfully', 3, setIsOpenDrawer(false))
      formEdit.resetFields()
      setStateUserDetails({image: ''})
    } else if(isErrorUpdate){
      message.error()
    }
  }, [isSuccessUpdate, isErrorUpdate])
  useEffect(() =>{
    formEdit.setFieldsValue(stateUserDetails)
  }, [formEdit, stateUserDetails])
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])
  const handleEditUser = () => {
    setIsOpenDrawer(true)
  }
  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
  }
  const onUpdateUser = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.accessToken, ...stateUserDetails}, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  }
  const handleOnchangeDetails = async (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  //delete one user
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const mutationDelete = useMutationHooks(
    (data) => {
      const { id,
        token } = data
      const res = UserService.deleteUser(
        id,
        token )
      return res
    },
  )
  const{data: dataDelete, isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete} = mutationDelete
  useEffect(() =>{
    if(isSuccessDelete && dataDelete?.status === 'OK'){
      message.success('Delete User Successfully', 3, setIsModalOpenDelete(false))
    } else if(isErrorDelete){
      message.error()
    }
  }, [isSuccessDelete, isErrorDelete])
  const handleDeleteUser = () => {
    mutationDelete.mutate({id: rowSelected, token: user?.accessToken}, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  }
//delete many users
const mutationDeletedMany = useMutationHooks(
  (data) => {
    const { token, ...ids} = data
    const res = UserService.deleteManyUser(
      {...ids},
      token )
    return res
  },
)
const{data: dataDeleteManyUser, isSuccess: isSuccessDeleteManyUser, isError: isErrorDeleteManyUser} = mutationDeletedMany
const handleDeleteManyUsers = (ids) => {
  mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
    onSettled: () => {
      queryUsers.refetch()
    }
  })
}
useEffect(() =>{
  if(isSuccessDeleteManyUser && dataDeleteManyUser?.status === 'OK'){
    message.success('Delete User Successfully')
  } else if(isErrorDeleteManyUser){
    message.error()
  }
}, [isSuccessDeleteManyUser, isErrorDeleteManyUser])
  return (
    <div style={{padding: '15px', width: '100%'}}>
        <WrapperHeader>Danh sách khách hàng</WrapperHeader>
        <TableComponent data ={dataTable} isLoading ={isLoadingUsers} columns={columns} handleDeleteMany ={handleDeleteManyUsers} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }}/>
        <DrawerComponent forceRender title='Chi tiết sản phẩm' isOpen ={isOpenDrawer} onClose={() => {setIsOpenDrawer(false)}} width ='60%'>
          <Loading isLoading={isLoadingUpdate}>
          <Form
              name="basic"
              labelAlign ="left"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                offset: 2,
                span: 22,
              }}
              style={{
                maxWidth: '90%',
              }}
              initialValues={{
                remember: false,
              }}
              onFinish={onUpdateUser}
              form={formEdit}
              autoComplete="off">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputSearch value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <InputSearch value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone!' }]}
            >
              <InputSearch value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <InputSearch value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
              <Form.Item
                label="Image"
                name="image"
                
                rules={[{ required: true, message: 'Please input your image!' }]}
              >
                <WrapperUploadFile valuePropName="checked" onChange={handleOnchangeAvatarDetails} maxCount={1}>
                  <div>
                  <Button  icon={<UploadOutlined />}>Select File</Button>
                  </div> 
                {stateUserDetails?.avatar && (
                    <img src={stateUserDetails?.avatar} style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginTop: '10px'
                    }} alt="avatar" />
                  )}
                </WrapperUploadFile>
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 19,
                    span: 5,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Apply
                  </Button>
                </Form.Item>
          </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent title="Xóa sản phẩm" isModalOpen={isModalOpenDelete} onOk={handleDeleteUser} onCancel={() => {setIsModalOpenDelete(false)}}>
          <Loading isLoading={isLoadingDelete}>
            <div>Bạn có chắc xóa sản phẩm này không?</div>
          </Loading>
        </ModalComponent> 
    </div>
  )
}

export default AdminUser