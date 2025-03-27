import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { fetchDiplomaBooks, addDiplomaBook } from '@/services/diplomaBook';

const SoVanBang = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDiplomaBooks().then((res) => setData(res));
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      addDiplomaBook(values).then(() => {
        fetchDiplomaBooks().then((res) => setData(res));
        setIsModalOpen(false);
        form.resetFields();
      });
    });
  };

  const columns = [
    { title: 'Số vào sổ', dataIndex: 'number', key: 'number' },
    { title: 'Năm', dataIndex: 'year', key: 'year' },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm sổ văn bằng
      </Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        title="Thêm sổ văn bằng"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="number" label="Số vào sổ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="year" label="Năm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SoVanBang;