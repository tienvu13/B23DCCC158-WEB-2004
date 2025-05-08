import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const TripPlan = () => {
  const [visible, setVisible] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [tripPlans, setTripPlans] = useState<any[]>([]);
  const [form] = Form.useForm(); // Sử dụng Form.useForm() để tạo form instance
  
  // Lấy dữ liệu destinations từ localStorage
  const destinations = JSON.parse(localStorage.getItem('destinations') || '[]');
  
  // Định nghĩa các hàm trước
  const handleEdit = (trip: any) => {
    setEditingTrip(trip);
    setVisible(true);
    form.setFieldsValue(trip); // Set form values to editing trip data
  };

  const handleDelete = (key: React.Key) => {
    const newTripPlans = tripPlans.filter((item) => item.key !== key);
    setTripPlans(newTripPlans);
    localStorage.setItem('tripPlans', JSON.stringify(newTripPlans));
  };

  // Columns for the table
  const columns = [
    {
      title: 'Tên điểm đến',
      dataIndex: 'destination',
      key: 'destination',
      render: (text: any) => text.join(', '), // Hiển thị danh sách các điểm đến
    },
    {
      title: 'Thời gian (ngày)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Chi phí di chuyển (VND)',
      dataIndex: 'transportCost',
      key: 'transportCost',
      render: (text: any) => text.toLocaleString('vi-VN'), // Định dạng tiền tệ
    },
    {
      title: 'Chi phí ăn uống (VND)',
      dataIndex: 'foodCost',
      key: 'foodCost',
      render: (text: any) => text.toLocaleString('vi-VN'), // Định dạng tiền tệ
    },
    {
      title: 'Chi phí dịch vụ (VND)',
      dataIndex: 'serviceCost',
      key: 'serviceCost',
      render: (text: any) => text.toLocaleString('vi-VN'), // Định dạng tiền tệ
    },
    {
      title: 'Tổng chi phí (VND)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (text: any) => text.toLocaleString('vi-VN'), // Định dạng tiền tệ
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    // Load trip plans from localStorage or default value
    const storedPlans = JSON.parse(localStorage.getItem('tripPlans') || '[]');
    setTripPlans(storedPlans);
  }, []);

  const handleAdd = () => {
    setEditingTrip(null);
    setVisible(true);
    form.resetFields(); // Reset form fields when opening modal
  };

  const handleOk = (values: any) => {
    let newTripPlans = [...tripPlans];
    const selectedDestinations = destinations.filter((dest: any) =>
      values.destinations.includes(dest.name)
    );
    
    // Chuyển các chi phí sang kiểu number và tính tổng chi phí
    const transportCost = Number(values.transportCost) || 0;
    const foodCost = Number(values.foodCost) || 0;
    const serviceCost = Number(values.serviceCost) || 0;
    const totalCost = transportCost + foodCost + serviceCost;
    
    if (editingTrip) {
      // Update the trip plan
      newTripPlans = newTripPlans.map((trip) =>
        trip.key === editingTrip.key ? { ...editingTrip, ...values, totalCost } : trip
      );
    } else {
      // Add new trip plan
      const newTrip = {
        ...values,
        key: Date.now(),
        destination: selectedDestinations.map((dest: any) => dest.name),
        totalCost,
      };
      newTripPlans.push(newTrip);
    }

    setTripPlans(newTripPlans);
    localStorage.setItem('tripPlans', JSON.stringify(newTripPlans));
    setVisible(false);
    message.success('Cập nhật thành công');
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm kế hoạch chuyến đi
      </Button>
      <Table
        columns={columns}
        dataSource={tripPlans}
        rowKey="key"
      />

      <Modal
        title={editingTrip ? 'Sửa kế hoạch chuyến đi' : 'Thêm kế hoạch chuyến đi'}
        visible={visible}
        onOk={() => form.submit()} // Dùng form.submit() để trigger sự kiện submit
        onCancel={handleCancel}
      >
        <Form
          form={form} // Liên kết form instance với Form
          initialValues={editingTrip}
          onFinish={handleOk}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            name="destinations"
            label="Điểm đến"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một điểm đến' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các điểm đến"
              allowClear
            >
              {destinations.map((dest: any) => (
                <Option key={dest.name} value={dest.name}>{dest.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời gian (ngày)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <Input type="number" placeholder="Thời gian" min={1} />
          </Form.Item>
          <Form.Item
            name="transportCost"
            label="Chi phí di chuyển (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập chi phí di chuyển' }]}
          >
            <Input type="number" placeholder="Chi phí di chuyển" min={0} />
          </Form.Item>
          <Form.Item
            name="foodCost"
            label="Chi phí ăn uống (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập chi phí ăn uống' }]}
          >
            <Input type="number" placeholder="Chi phí ăn uống" min={0} />
          </Form.Item>
          <Form.Item
            name="serviceCost"
            label="Chi phí dịch vụ (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập chi phí dịch vụ' }]}
          >
            <Input type="number" placeholder="Chi phí dịch vụ" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TripPlan;
