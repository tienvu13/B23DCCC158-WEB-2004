import { useState } from 'react';
import { Table, Form, Input, Button } from 'antd';
import { searchDiplomas } from '@/services/diplomaSearch';

const TraCuuVanBang = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  const handleSearch = () => {
    form.validateFields().then((values) => {
      searchDiplomas(values).then((res) => setData(res));
    });
  };

  const columns = [
    { title: 'Số hiệu văn bằng', dataIndex: 'degreeNumber', key: 'degreeNumber' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate' },
  ];

  return (
    <div>
      <Form form={form} layout="inline" onFinish={handleSearch}>
        <Form.Item name="degreeNumber" label="Số hiệu văn bằng">
          <Input />
        </Form.Item>
        <Form.Item name="fullName" label="Họ tên">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tra cứu
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default TraCuuVanBang;