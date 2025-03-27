import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { fetchDecisions, addDecision } from '@/services/decision';

const QuyetDinhTotNghiep = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDecisions().then((res) => setData(res));
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      addDecision(values).then(() => {
        fetchDecisions().then((res) => setData(res));
        setIsModalOpen(false);
        form.resetFields();
      });
    });
  };

  const columns = [
    { title: 'Số quyết định', dataIndex: 'number', key: 'number' },
    { title: 'Ngày ban hành', dataIndex: 'date', key: 'date' },
    { title: 'Trích yếu', dataIndex: 'summary', key: 'summary' },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm quyết định
      </Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        title="Thêm quyết định"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="number" label="Số quyết định" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Ngày ban hành" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="summary" label="Trích yếu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuyetDinhTotNghiep;