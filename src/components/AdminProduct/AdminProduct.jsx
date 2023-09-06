/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { Button, Form, Input, Select, Space, message } from 'antd'
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import InputSearch from '../InputSearch/InputSearch'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { useForm } from 'antd/es/form/Form'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import Highlighter from "react-highlight-words" 
const AdminProduct = () => {
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
        <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer', marginLeft: '5px' }} onClick={handleDetailsProduct} />
      </div>
    )
  }
  const inittial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: 'ddd',
    countInStock: '',
    newType: '',
    discount: '',

  })
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }
  const queryProducts = useQuery(['products'], fetchProductAll)
  const { isLoading: isLoadingProducts, data: products } = queryProducts 
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
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
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 50',
          value: '>=',
        },
        {
          text: '<= 50',
          value: '<=',
        }
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 50
        }
        return record.price <= 50
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '<= 3',
          value: '<=',
        }
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.rating) >= 3
        }
        return Number(record.rating) <= 3
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  //Create
  const [formCreate] = useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stateProduct, setStateProduct] = useState(inittial())
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }
  const mutation = useMutationHooks(
    (data) => ProductService.createProduct(data)
  )
  const{data, isLoading, isSuccess, isError} = mutation
  useEffect(() =>{
    if(isSuccess && data?.status === 'OK'){
      message.success('Create Product Successfully', 3, setIsModalOpen(false))
      formCreate.resetFields()
      setStateProduct({image: ''})
    } else if(isError){
      message.error()
    }
  }, [isSuccess, isError])
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProducts.refetch()
      }
    })
  }
  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }
 
  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  const {data: typeProduct} = useQuery(['typeproduct'], fetchAllTypeProduct)
  //Edit
  const handleChangeSelectDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value
    })
  }
  const fetchGetDetailsProduct = async (rowSelected) => {
    setStateProductDetails(inittial())
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails(res.data)
    }
  }
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [formEdit] = useForm()
  const [stateProductDetails, setStateProductDetails] = useState(inittial())
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = ProductService.updateProduct(
        id,
        token,
        {...rests} )
      return res
    },
  )
  const{data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate} = mutationUpdate
  useEffect(() =>{
    if(isSuccessUpdate && dataUpdate?.status === 'OK'){
      message.success('Edit Product Successfully', 3, setIsOpenDrawer(false))
      formEdit.resetFields()
      setStateProductDetails({image: ''})
    } else if(isErrorUpdate){
      message.error()
    }
  }, [isSuccessUpdate, isErrorUpdate])
  useEffect(() =>{
    formEdit.setFieldsValue(stateProductDetails)
  }, [formEdit, stateProductDetails])
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }
  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }
  const onUpdateProduct = () => {
    const params = {
      name: stateProductDetails.name,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      rating: stateProductDetails.rating,
      image: stateProductDetails.image,
      type: stateProductDetails.type === 'add_type' ? stateProductDetails.newType : stateProductDetails.type,
      countInStock: stateProductDetails.countInStock,
      discount: stateProductDetails.discount
    }
    mutationUpdate.mutate({id: rowSelected, token: user?.accessToken, ...params}, {
      onSettled: () => {
        queryProducts.refetch()
      }
    }
      )
  }
  const handleOnchangeDetails = async (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
  //delete one product
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const mutationDelete = useMutationHooks(
    (data) => {
      const { id,
        token } = data
      const res = ProductService.deleteProduct(
        id,
        token )
      return res
    },
  )
  const{data: dataDelete, isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete} = mutationDelete
  useEffect(() =>{
    if(isSuccessDelete && dataDelete?.status === 'OK'){
      message.success('Delete Product Successfully', 3, setIsModalOpenDelete(false))
    } else if(isErrorDelete){
      message.error()
    }
  }, [isSuccessDelete, isErrorDelete])
  const handleDeleteProduct = () => {
    mutationDelete.mutate({id: rowSelected, token: user?.accessToken}, {
      onSettled: () => {
        queryProducts.refetch()
      }
    }
      )
  }
  //delete many products
  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids} = data
      const res = ProductService.deleteManyProduct(
        {...ids},
        token )
      return res
    },
  )
  const{data: dataDeleteManyProduct, isSuccess: isSuccessDeleteManyProduct, isError: isErrorDeleteManyProduct} = mutationDeletedMany
  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProducts.refetch()
      }
    })
  }
  useEffect(() =>{
    if(isSuccessDeleteManyProduct && dataDeleteManyProduct?.status === 'OK'){
      message.success('Delete Product Successfully')
    } else if(isErrorDeleteManyProduct){
      message.error()
    }
  }, [isSuccessDeleteManyProduct, isErrorDeleteManyProduct])
  return (
    <div style={{padding: '15px', width: '100%'}}>
        <WrapperHeader>Danh sách sản phẩm</WrapperHeader>
        <div style={{ marginTop: '10px' }}>
          <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={showModal}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
        </div> 
        <TableComponent data ={dataTable} isLoading ={isLoadingProducts} columns={columns} handleDeleteMany={handleDeleteManyProducts} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }}/>
        <ModalComponent forceRender title="Tạo sản phẩm" isModalOpen={isModalOpen} footer={null} onCancel={() => {setIsModalOpen(false)}}>
          <Loading isLoading={isLoading}>
          <Form
              name="basic"
              labelAlign ="left"
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: false,
              }}
              onFinish={onFinish}
              form={formCreate}
              autoComplete="off">
                <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name of product!' }]}
              >
                <InputSearch value={stateProduct['name']} onChange={handleOnchange} name="name"/>
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please input your type of product!' }]}
              >
                <Select
                  name="type"
                  value={stateProduct.type}
                  onChange={handleChangeSelect}
                  options={renderOptions(typeProduct?.data)}
                  />
              </Form.Item>
              {stateProduct.type === 'add_type' && (
                <Form.Item
                  label='New type'
                  name="newType"
                  rules={[{ required: true, message: 'Please input your type !' }]}
                >
                  <InputSearch value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                </Form.Item>
              )}
              <Form.Item
                label="Count inStock"
                name="countInStock"
                rules={[{ required: true, message: 'Please input your count inStock of product!' }]}
              >
                <InputSearch value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input your price of product!' }]}
              >
                <InputSearch value={stateProduct.price} onChange={handleOnchange} name="price" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input your description of product!' }]}
              >
                <InputSearch value={stateProduct.description} onChange={handleOnchange} name="description" />
              </Form.Item>
              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: 'Please input your rating of product!' }]}
              >
                <InputSearch value={stateProduct.rating} onChange={handleOnchange} name="rating" />
              </Form.Item>
              <Form.Item
                label="Discount"
                name="discount"
                rules={[{ required: true, message: 'Please input your discount of product!' }]}
              >
                <InputSearch value={stateProduct.discount} onChange={handleOnchange} name="discount" />
              </Form.Item>
              <Form.Item
                label="Image"
                name="image"
                
                rules={[{ required: true, message: 'Please input your count image!' }]}
              >
                <WrapperUploadFile valuePropName="checked" onChange={handleOnchangeAvatar} maxCount={1}>
                  <div>
                  <Button  icon={<UploadOutlined />}>Select File</Button>
                  </div> 
                {stateProduct?.image && (
                    <img src={stateProduct?.image} style={{
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
                    Submit
                  </Button>
                </Form.Item>
          </Form>
          </Loading>
        </ModalComponent> 
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
              onFinish={onUpdateProduct}
              form={formEdit}
              autoComplete="off">
                <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name of product!' }]}
              >
                <InputSearch value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name"/>
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please input your type of product!' }]}
              >
                <Select
                  name="type"
                  value={stateProductDetails.type}
                  onChange={handleChangeSelectDetails}
                  options={renderOptions(typeProduct?.data)}
                  />
              </Form.Item>
              {stateProductDetails.type === 'add_type' && (
                <Form.Item
                  label='New type'
                  name="newType"
                  rules={[{ required: true, message: 'Please input your type !' }]}
                >
                  <InputSearch value={stateProductDetails.newType} onChange={handleOnchangeDetails} name="newType" />
                </Form.Item>
              )}
              <Form.Item
                label="Count inStock"
                name="countInStock"
                rules={[{ required: true, message: 'Please input your count inStock of product!' }]}
              >
                <InputSearch value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input your price of product!' }]}
              >
                <InputSearch value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input your description of product!' }]}
              >
                <InputSearch value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
              </Form.Item>
              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: 'Please input your rating of product!' }]}
              >
                <InputSearch value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
              </Form.Item>
              <Form.Item
                label="Discount"
                name="discount"
                rules={[{ required: true, message: 'Please input your discount of product!' }]}
              >
                <InputSearch value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
              </Form.Item>
              <Form.Item
                label="Image"
                name="image"
                
                rules={[{ required: true, message: 'Please input your count image!' }]}
              >
                <WrapperUploadFile valuePropName="checked" onChange={handleOnchangeAvatarDetails} maxCount={1}>
                  <div>
                  <Button  icon={<UploadOutlined />}>Select File</Button>
                  </div> 
                {stateProductDetails?.image && (
                    <img src={stateProductDetails?.image} style={{
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
        <ModalComponent title="Xóa sản phẩm" isModalOpen={isModalOpenDelete} onOk={handleDeleteProduct} onCancel={() => {setIsModalOpenDelete(false)}}>
          <Loading isLoading={isLoadingDelete}>
            <div>Bạn có chắc xóa sản phẩm này không?</div>
          </Loading>
        </ModalComponent> 
    </div>
  )
}

export default AdminProduct