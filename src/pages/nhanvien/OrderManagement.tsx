import React, { useState, useEffect } from "react";
import { Table, Form, Input, Select, Button, message, Modal } from "antd";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "@/services/nhanVien";
import { Employee } from "@/models/nhanvien/employee";

const { Option } = Select;

const positions = ["Nhân viên", "Trưởng phòng", "Giám đốc"];
const departments = ["Kế toán", "Nhân sự", "IT", "Kinh doanh"];

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form] = Form.useForm();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const generateEmployeeId = () => `NV${(getEmployees().length + 1).toString().padStart(3, "0")}`;

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingEmployee) {
        const updatedEmployee = { ...values, id: editingEmployee.id };
        updateEmployee(updatedEmployee);
      } else {
        const newEmployee = { ...values, id: generateEmployeeId() };
        addEmployee(newEmployee);
      }
      setEmployees([...getEmployees()]);
      setIsModalVisible(false);
      form.resetFields();
    }).catch(() => message.error("Vui lòng điền đầy đủ thông tin!"));
  };

  const handleDelete = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee?.status === "Đã ký hợp đồng") {
      message.error("Không thể xóa nhân viên đã ký hợp đồng!");
      return;
    }
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa?",
      onOk: () => {
        deleteEmployee(id);
        setEmployees([...getEmployees()]);
      },
    });
  };

  const filteredEmployees = employees.filter(emp =>
    (filterPosition ? emp.position === filterPosition : true) &&
    (filterDepartment ? emp.department === filterDepartment : true) &&
    (searchText ? emp.id.includes(searchText) || emp.name.toLowerCase().includes(searchText.toLowerCase()) : true)
  );

  const columns = [
    { title: "Mã NV", dataIndex: "id", key: "id" },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Chức vụ", dataIndex: "position", key: "position" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      render: (salary: number) => `$${salary.toLocaleString("en-US")}`, // Hiển thị lương theo định dạng USD
      sorter: (a: Employee, b: Employee) => b.salary - a.salary,
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      render: (_: any, record: Employee) => (
        <>
          <Button onClick={() => { setEditingEmployee(record); setIsModalVisible(true); }}>Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Input placeholder="Tìm kiếm theo mã, họ tên" onChange={e => setSearchText(e.target.value)} style={{ width: 200, marginRight: 10 }} />
      <Select placeholder="Lọc theo chức vụ" onChange={setFilterPosition} allowClear style={{ width: 150, marginRight: 10 }}>
        {positions.map(pos => <Option key={pos} value={pos}>{pos}</Option>)}
      </Select>
      <Select placeholder="Lọc theo phòng ban" onChange={setFilterDepartment} allowClear style={{ width: 150, marginRight: 10 }}>
        {departments.map(dep => <Option key={dep} value={dep}>{dep}</Option>)}
      </Select>
      <Button type="primary" onClick={() => { setEditingEmployee(null); setIsModalVisible(true); }}>Thêm nhân viên</Button>
      <Table columns={columns} dataSource={filteredEmployees} rowKey="id" />

      <Modal title={editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"} visible={isModalVisible} onOk={handleSave} onCancel={() => setIsModalVisible(false)}>        
        <Form form={form} layout="vertical" initialValues={editingEmployee || {}}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: "Nhập họ tên!" }, { max: 50, message: "Tối đa 50 ký tự!" }]}>            
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" rules={[{ required: true, message: "Chọn chức vụ!" }]}>            
            <Select placeholder="Chọn chức vụ">
              {positions.map(pos => <Option key={pos} value={pos}>{pos}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Phòng ban" rules={[{ required: true, message: "Chọn phòng ban!" }]}>            
            <Select placeholder="Chọn phòng ban">
              {departments.map(dep => <Option key={dep} value={dep}>{dep}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="salary" label="Lương" rules={[{ required: true, message: "Nhập lương!" }]}>            
            <Input type="number" placeholder="Nhập lương" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái!" }]}>            
            <Select placeholder="Chọn trạng thái">
              <Option value="Đã ký hợp đồng">Đã ký hợp đồng</Option>
              <Option value="Thử việc">Thử việc</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeManagement;
