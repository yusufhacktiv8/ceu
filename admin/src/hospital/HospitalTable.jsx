import React from 'react';
import { Table, Button, Popconfirm } from 'antd';

const Column = Table.Column;

export default ({
  hospitals,
  loading,
  count,
  currentPage,
  pageSize,
  onChange,
  openEditWindow,
  deleteHospital,
}) => (
  <Table
    dataSource={hospitals}
    rowKey="id"
    loading={loading}
    pagination={{
      total: count,
      current: currentPage,
      pageSize,
    }}
    onChange={onChange}
    size="small"
  >
    <Column
      title="Code"
      dataIndex="code"
      key="code"
      render={(columnText, record) => {
        const reg = new RegExp(this.state.searchText, 'gi');
        const match = columnText.match(reg);
        return (
          <span key={record.code}>
            {columnText.split(reg).map((text, i) => (
              i > 0 ? [<span key={record.code} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
            ))}
          </span>
        );
      }}
    />
    <Column
      title="Name"
      dataIndex="name"
      key="name"
      render={(columnText, record) => {
        const reg = new RegExp(this.state.searchText, 'gi');
        const match = columnText.match(reg);
        return (
          <span key={record.code}>
            {columnText.split(reg).map((text, i) => (
              i > 0 ? [<span key={record.code} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
            ))}
          </span>
        );
      }}
    />
    <Column
      title="Action"
      key="action"
      render={(text, record) => (
        <span>
          <Button
            icon="ellipsis"
            size="small"
            onClick={() => openEditWindow(record)}
            style={{ marginRight: 5 }}
          />
          <Popconfirm
            title={`Are you sure delete hospital ${record.name}`}
            onConfirm={() => deleteHospital(record)}
            okText="Yes" cancelText="No"
          >
            <Button
              type="danger"
              icon="delete"
              size="small"
            />
          </Popconfirm>
        </span>
      )}
    />
  </Table>
);
