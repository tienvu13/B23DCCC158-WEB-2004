import { useState, useEffect } from 'react';
import { Input, Button, notification, Card, Row, Col, Progress, Divider } from 'antd';

const { Meta } = Card;

const BudgetManagement = () => {
  // State cho ngân sách và chi phí
  const [budget, setBudget] = useState<number>(0); // Tổng ngân sách
  const [foodCost, setFoodCost] = useState<number>(0); // Chi phí ăn uống
  const [transportCost, setTransportCost] = useState<number>(0); // Chi phí di chuyển
  const [accommodationCost, setAccommodationCost] = useState<number>(0); // Chi phí lưu trú
  const [otherCost, setOtherCost] = useState<number>(0); // Chi phí khác

  const totalCost = Math.floor(foodCost) + Math.floor(transportCost) + Math.floor(accommodationCost) + Math.floor(otherCost);

  // Lấy thông tin từ localStorage
  useEffect(() => {
    const storedDestinations = localStorage.getItem('destinations');
    if (storedDestinations) {
      const destinations = JSON.parse(storedDestinations);
      
      // Tính tổng ngân sách cho các địa điểm đã chọn
      const selectedDestinationsTotal = destinations
        .filter((destination: any) => destination.selected)  // Lọc các địa điểm đã chọn
        .reduce((total: number, destination: any) => total + (destination.price || 0), 0); // Cộng dồn giá trị price của các địa điểm đã chọn

      setBudget(selectedDestinationsTotal); // Cập nhật tổng ngân sách
    }
  }, []);

  const handleBudgetChange = (value: number) => {
    setBudget(value);
  };

  const handleCostChange = (category: string, value: number) => {
    switch (category) {
      case 'food':
        setFoodCost(value);
        break;
      case 'transport':
        setTransportCost(value);
        break;
      case 'accommodation':
        setAccommodationCost(value);
        break;
      case 'other':
        setOtherCost(value);
        break;
      default:
        break;
    }
  };

  const checkBudget = () => {
    if (totalCost > budget) {
      notification.warning({
        message: 'Cảnh báo!',
        description: 'Tổng chi phí đã vượt quá ngân sách.',
        duration: 2,
      });
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ textAlign: 'center' }}>Quản lý ngân sách du lịch</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Meta title="Tổng ngân sách" />
            <Input
              type="number"
              placeholder="Nhập tổng ngân sách"
              value={budget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Meta title="Chi phí" />
            <div>
              <Input
                type="number"
                placeholder="Chi phí ăn uống"
                value={foodCost}
                onChange={(e) => handleCostChange('food', Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Chi phí di chuyển"
                value={transportCost}
                onChange={(e) => handleCostChange('transport', Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Chi phí lưu trú"
                value={accommodationCost}
                onChange={(e) => handleCostChange('accommodation', Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Chi phí khác"
                value={otherCost}
                onChange={(e) => handleCostChange('other', Number(e.target.value))}
              />
            </div>
            <Button type="primary" onClick={checkBudget} style={{ marginTop: '16px' }}>
              Kiểm tra ngân sách
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h3>Tổng chi phí: {totalCost.toLocaleString()} VNĐ</h3>
        <h3>Ngân sách còn lại: {budget - totalCost > 0 ? (budget - totalCost).toLocaleString() : 0} VNĐ</h3>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <h3>Biểu đồ phân bổ ngân sách</h3>
        <Divider />
        <div style={{ marginBottom: '16px' }}>
          <Progress
            percent={(foodCost / budget) * 100}
            status={foodCost > budget ? 'exception' : 'active'}
            strokeColor="#ff7f50"
            format={(percent) => `Ăn uống: ${foodCost.toLocaleString()} VNĐ`}
          />
          <Progress
            percent={(transportCost / budget) * 100}
            status={transportCost > budget ? 'exception' : 'active'}
            strokeColor="#87cefa"
            format={(percent) => `Di chuyển: ${transportCost.toLocaleString()} VNĐ`}
          />
          <Progress
            percent={(accommodationCost / budget) * 100}
            status={accommodationCost > budget ? 'exception' : 'active'}
            strokeColor="#ffb6c1"
            format={(percent) => `Lưu trú: ${accommodationCost.toLocaleString()} VNĐ`}
          />
          <Progress
            percent={(otherCost / budget) * 100}
            status={otherCost > budget ? 'exception' : 'active'}
            strokeColor="#32cd32"
            format={(percent) => `Chi phí khác: ${otherCost.toLocaleString()} VNĐ`}
          />
        </div>
      </Card>
    </div>
  );
};

export default BudgetManagement;