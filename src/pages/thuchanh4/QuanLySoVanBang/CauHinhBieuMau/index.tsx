import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { fetchTemplateFields, addTemplateField, deleteTemplateField } from '@/services/templateConfig';

const { Option } = Select;

const CauHinhBieuMau = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTemplateFields().then((res) => setData(res));
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      addTemplateField(values).then(() => {
        fetchTemplateFields().then((res) => setData(res));
        setIsModalOpen(false);
        form.resetFields();
      });
    });
  };

  const handleDelete = (id: string) => {
    deleteTemplateField(id).then(() => {
      fetchTemplateFields().then((res) => setData(res));
    });
  };

  const columns = [
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: { id: string; name: string; type: string }) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm trường thông tin
      </Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        title="Thêm trường thông tin"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên trường" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true }]}>
            <Select>
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Date">Date</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauHinhBieuMau;