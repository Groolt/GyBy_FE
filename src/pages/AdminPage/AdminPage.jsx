import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { AppstoreOutlined, UserOutlined, FormOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
const AdminPage = () => {
  const renderPage = (key) => {
    switch(key){
      case 'userInfo':
        return (<AdminUser/>)
      case 'productInfo':
        return (<AdminProduct/>)
        case 'order':
          return (<AdminOrder/>)
      default:
        return <></>
    }
  }
  const items = [
    getItem('Khách hàng', 'sub1', <UserOutlined />, [
      getItem('Danh sách khách hàng', 'userInfo'),
      getItem('Thêm khách hàng', 'addUser'),
    ]),
    getItem('Sản phẩm', 'sub2', <AppstoreOutlined />, [
      getItem('Danh sách sản phẩm', 'productInfo'),
    ]),
    getItem('Hóa đơn', 'sub3', <FormOutlined/>, [
      getItem('Danh sách hóa đơn', 'order'),
    ]),
  ];
  const rootSubmenuKeys = ['user', 'product']
  const [keySelected, setKeySelected] = useState('');
  const [openKeys, setOpenKeys] = useState(['user']);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleOnClick = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    setKeySelected(key)
  }
  return (
    <div>
        <HeaderComponent isHiddenSearch isHiddenCart />
        <div style={{display: 'flex'}}>
        <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
          boxShadow: '1px 1px 2px #ccc',
          borderRadius: '0px',
          minHeight: '100vh'
        }}
        items={items}
        onClick={handleOnClick}/>
        {renderPage(keySelected)}
      </div>
    </div>
  )
}

export default AdminPage