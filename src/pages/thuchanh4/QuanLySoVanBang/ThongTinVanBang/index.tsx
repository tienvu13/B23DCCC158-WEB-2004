import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { fetchDiplomas, addDiploma } from '@/services/diplomaInfo';
import { fetchTemplateFields } from '@/services/templateConfig';

const ThongTinVanBang = () => {
  const [data, setData] = useState<{ entryNumber: number; [key: string]: any }[]>([]);
  const [fields, setFields] = useState<{ name: string; required: boolean; type: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDiplomas().then((res) => setData(res));
    fetchTemplateFields().then((res) => setFields(res));
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      // Lưu dữ liệu đầy đủ, bao gồm cả các trường tùy chỉnh
      const newDiploma = {
        ...values,
        entryNumber: values.entryNumber, // Số vào sổ
        degreeNumber: values.degreeNumber, // Số hiệu văn bằng
        studentId: values.studentId, // Mã sinh viên
        fullName: values.fullName, // Họ tên
        birthDate: values.birthDate?.format('YYYY-MM-DD'), // Ngày sinh
      };

      addDiploma(newDiploma).then(() => {
        fetchDiplomas().then((res) => setData(res));
        setIsModalOpen(false);
        form.resetFields();
      });
    });
  };

  const openModal = () => {
    // Tự động tính "Số vào sổ" tiếp theo
    const nextEntryNumber = data.length > 0 ? data[data.length - 1].entryNumber + 1 : 1;
    form.setFieldsValue({ entryNumber: nextEntryNumber });
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Số vào sổ', dataIndex: 'entryNumber', key: 'entryNumber' },
    { title: 'Số hiệu văn bằng', dataIndex: 'degreeNumber', key: 'degreeNumber' },
    { title: 'Mã sinh viên', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate' },
    ...fields.map((field) => ({
      title: field.name,
      dataIndex: field.name,
      key: field.name,
    })),
  ];

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        Thêm văn bằng
      </Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        title="Thêm văn bằng"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="entryNumber" label="Số vào sổ" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="degreeNumber" label="Số hiệu văn bằng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="studentId" label="Mã sinh viên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthDate" label="Ngày sinh" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          {fields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.name}
              rules={[{ required: field.required }]}
            >
              {field.type === 'String' && <Input />}
              {field.type === 'Number' && <Input type="number" />}
              {field.type === 'Date' && <DatePicker />}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
};

export default ThongTinVanBang;