import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({title = 'Modal', isModalOpen = 'false', children, ...rests}) => {
  return (
    <Modal title= {title} open={isModalOpen} {...rests}>
        {children}
      </Modal>
  )
}

export default ModalComponent