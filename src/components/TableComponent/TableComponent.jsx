/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from 'react';
import { Divider, Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { Excel } from "antd-table-saveas-excel";
const TableComponent = (props) => {
  const { selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys)
    setRowSelectedKeys([])
  }
  const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    setRowSelectedKeys(selectedRowKeys)
  },
  getCheckboxProps: (record) => ({
    disabled: record.isAdmin === true,
    // Column configuration not to be checked
    name: record.name,
  }),
};
const exportExcel = () => {
  const excel = new Excel();
  excel
    .addSheet("test")
    .addColumns(newColumnExport)
    .addDataSource(dataSource, {
      str2Percent: true
    })
    .saveAs("Excel.xlsx");
};
  return (
    <div>
      <Divider />
      <Loading isLoading={isLoading}>
      {!!rowSelectedKeys.length && (
        <div style={{
          background: '#1d1ddd',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <button onClick={exportExcel}>Export Excel</button>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataSource}
          {...props}
        />
      </Loading>
    </div>
  );
};
export default TableComponent;