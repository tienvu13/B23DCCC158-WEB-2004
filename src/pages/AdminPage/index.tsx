import { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Input, Rate, Select, Upload, message, Card, Row, Col, Popconfirm
} from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface Destination {
  id: number;
  name: string;
  location: string;
  type: string;
  price: number;
  rating: number;
  image?: string;
}

const STORAGE_KEY = 'destinations';

const Admin = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Destination[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Destination | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (items: Destination[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newItem: Destination = {
        ...values,
        id: Date.now(),
        image: values.image?.fileList[0]?.thumbUrl || '', // Dùng thumbUrl để lấy ảnh đại diện từ Upload
      };
      const updated = [...data, newItem];
      setData(updated);
      saveToStorage(updated);
      setIsModalOpen(false);
      form.resetFields();
      message.success('Đã thêm điểm đến!');
    });
  };

  const handleEdit = (item: Destination) => {
    form.setFieldsValue({ ...item, image: { fileList: [{ thumbUrl: item.image }] } });
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const updated = data.filter(item => item.id !== id);
    setData(updated);
    saveToStorage(updated);
    message.success('Đã xóa điểm đến!');
  };

  const handleImageUpload = (file: any) => {
    // Nếu bạn muốn lưu trữ hình ảnh dưới dạng base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      form.setFieldsValue({ image: { fileList: [{ thumbUrl: reader.result as string }] } });
    };
    return false; // Prevent automatic upload
  };

  return (
    <>
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Quản lí địa điểm</h1>
      <Row gutter={[16, 16]}>
        {data.map((destination) => (
          <Col xs={24} sm={12} md={8} lg={8} key={destination.id}>
            <Card
              hoverable
              cover={<img alt={destination.name} src={destination.image} />}
              actions={[
                <Button
                  key="edit"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(destination)}
                >
                  Sửa
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Bạn có chắc muốn xóa?"
                  onConfirm={() => handleDelete(destination.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="link" icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={destination.name}
                description={
                  <>
                    <div>{destination.location}</div>
                    <Rate disabled value={destination.rating} />
                    <div>{destination.type}</div>
                    <div><strong>Giá:</strong> {destination.price ? destination.price.toLocaleString() : 'Chưa có'} VNĐ</div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
        
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            hoverable
            style={{
              minHeight: 200,
              borderRadius: 8, 
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
              transition: 'transform 0.3s ease', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
            cover={
              <div
                style={{
                  height: 150,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="large"
                  style={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    fontSize: '160px',
                    width:'128px',
                    height:'128px',
                  }}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            }
          >
            <div style={{ marginTop: 10, fontWeight: 'bold', fontSize: '16px', color: '#d32f2f' }}>
              Thêm địa điểm
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title={currentItem ? 'Sửa điểm đến' : 'Thêm điểm đến'}
        visible={isModalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Biển', value: 'sea' },
              { label: 'Núi', value: 'mountain' },
              { label: 'Thành phố', value: 'city' },
            ]} />
          </Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="rating" label="Đánh giá">
            <Rate />
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh">
            <Upload
              beforeUpload={handleImageUpload} 
              showUploadList={false} // Ẩn danh sách file upload
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Admin;