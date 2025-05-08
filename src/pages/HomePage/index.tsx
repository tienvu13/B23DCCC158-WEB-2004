import { useEffect, useState } from 'react';
import { Card, Col, Row, Rate, Select, Input } from 'antd';

const { Option } = Select;

interface Destination {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  image?: string;
  price?: number; // ➕ Thêm giá
}

const HomePage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered] = useState<Destination[]>([]);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>('name');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('destinations');
    const data: Destination[] = stored ? JSON.parse(stored) : [];
    setDestinations(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let data = [...destinations];

    if (filterType) {
      data = data.filter(item => item.type === filterType);
    }

    if (search.trim()) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    setFiltered(data);
  }, [filterType, sortBy, search, destinations]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Khám phá điểm đến</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Lọc theo loại hình"
            onChange={value => setFilterType(value)}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="sea">Biển</Option>
            <Option value="mountain">Núi</Option>
            <Option value="city">Thành phố</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            defaultValue="name"
            onChange={value => setSortBy(value)}
            style={{ width: '100%' }}
          >
            <Option value="name">Sắp xếp theo tên</Option>
            <Option value="rating">Sắp xếp theo đánh giá</Option>
            <Option value="price">Sắp xếp theo giá</Option> {/* ➕ */}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Input.Search
            placeholder="Tìm theo tên hoặc địa điểm"
            allowClear
            onSearch={value => setSearch(value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {filtered.map(destination => (
          <Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
            <Card
              hoverable
              cover={
                destination.image ? (
                  <img
                    alt={destination.name}
                    src={destination.image}
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: 180, background: '#eee' }} />
                )
              }
            >
              <Card.Meta
                title={destination.name}
                description={
                  <>
                    <div>{destination.location}</div>
                    <Rate disabled value={destination.rating} />
                    <div><strong>Loại:</strong> {destination.type}</div>
                    <div><strong>Giá:</strong> {destination.price ? destination.price.toLocaleString() : 'Chưa có'} VNĐ</div> {/* ➕ */}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;