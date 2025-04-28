"use client";
import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, DatePicker, Input, Button, Modal, Form, Select } from 'antd';
import { 
  DollarOutlined, 
  DropboxOutlined, 
  FileTextOutlined, 
  TeamOutlined,
  AuditOutlined,
  BarChartOutlined 
} from '@ant-design/icons';
import '../../styles/hr.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

function HRDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryData, setInventoryData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - replace with API calls in production
  useEffect(() => {
    // Mock inventory data
    const mockInventoryData = [
      {
        id: '1',
        type: 'water',
        date: '2023-06-15',
        quantity: 5000,
        unit: 'liters',
        amountPaid: 25000,
        supplier: 'AquaPure',
        paymentStatus: 'paid',
        recordedBy: 'John Doe'
      },
      {
        id: '2',
        type: 'shrink_wrap',
        date: '2023-06-10',
        quantity: 200,
        unit: 'rolls',
        amountPaid: 15000,
        supplier: 'PackPro',
        paymentStatus: 'paid',
        recordedBy: 'Jane Smith'
      },
      {
        id: '3',
        type: 'labels',
        date: '2023-06-05',
        quantity: 10000,
        unit: 'pieces',
        amountPaid: 8000,
        supplier: 'LabelMasters',
        paymentStatus: 'pending',
        recordedBy: 'John Doe'
      },
    ];

    // Mock payment data
    const mockPaymentData = [
      {
        id: 'p1',
        type: 'salary',
        date: '2023-06-01',
        amount: 450000,
        employee: 'Factory Team',
        paymentMethod: 'bank transfer',
        status: 'completed'
      },
      {
        id: 'p2',
        type: 'supplier',
        date: '2023-06-03',
        amount: 25000,
        recipient: 'AquaPure',
        paymentMethod: 'check',
        status: 'completed'
      },
      {
        id: 'p3',
        type: 'utility',
        date: '2023-06-05',
        amount: 12000,
        recipient: 'Power Company',
        paymentMethod: 'online',
        status: 'completed'
      },
    ];

    setInventoryData(mockInventoryData);
    setPaymentData(mockPaymentData);
  }, []);

  const filteredInventoryData = inventoryData.filter(item => {
    const matchesSearch = item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!dateRange) return matchesSearch;
    
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    
    return matchesSearch && itemDate >= startDate && itemDate <= endDate;
  });

  const filteredPaymentData = paymentData.filter(item => {
    const matchesSearch = item.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!dateRange) return matchesSearch;
    
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    
    return matchesSearch && itemDate >= startDate && itemDate <= endDate;
  });

  const handleAddRecord = () => {
    setCurrentRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRecord = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteRecord = (id) => {
    // In production, this would be an API call
    setInventoryData(prev => prev.filter(item => item.id !== id));
  };

  const handleModalSubmit = () => {
    form.validateFields().then(values => {
      // In production, this would be an API call
      if (currentRecord) {
        setInventoryData(prev => 
          prev.map(item => item.id === currentRecord.id ? { ...item, ...values } : item)
        );
      } else {
        setInventoryData(prev => [
          ...prev,
          {
            ...values,
            id: Date.now().toString(),
            recordedBy: 'Current User', // Replace with actual user
            paymentStatus: 'pending'
          }
        ]);
      }
      setIsModalVisible(false);
    });
  };

  const calculateInventoryStats = () => {
    const waterIntake = inventoryData
      .filter(item => item.type === 'water')
      .reduce((sum, item) => sum + item.quantity, 0);
    
    const totalSpent = inventoryData.reduce((sum, item) => sum + item.amountPaid, 0);
    
    const pendingPayments = inventoryData
      .filter(item => item.paymentStatus === 'pending')
      .reduce((sum, item) => sum + item.amountPaid, 0);
    
    return { waterIntake, totalSpent, pendingPayments };
  };

  const { waterIntake, totalSpent, pendingPayments } = calculateInventoryStats();

  const inventoryColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const types = {
          water: 'Water Intake',
          shrink_wrap: 'Shrink Wrap',
          labels: 'Labels'
        };
        return types[text] || text;
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => `${text} ${record.unit}`
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (text) => `₦${text.toLocaleString()}`
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier'
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text) => (
        <span className={`status-${text}`}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => handleEditRecord(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteRecord(record.id)}>Delete</Button>
        </div>
      )
    }
  ];

  const paymentColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1)
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `₦${text.toLocaleString()}`
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient'
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className={`status-${text}`}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      )
    }
  ];

  return (
    <div className="hr-dashboard">
      <header className="dashboard-header">
        <h1><AuditOutlined /> HR Management Dashboard</h1>
        <div className="controls">
          <Input.Search 
            placeholder="Search records..." 
            onSearch={value => setSearchTerm(value)}
            style={{ width: 300 }}
          />
          <RangePicker onChange={dates => setDateRange(dates)} />
        </div>
      </header>

      <nav className="tabs">
        <Button 
          type={activeTab === 'inventory' ? 'primary' : 'default'}
          icon={<DropboxOutlined />}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory Records
        </Button>
        <Button 
          type={activeTab === 'payments' ? 'primary' : 'default'}
          icon={<DollarOutlined />}
          onClick={() => setActiveTab('payments')}
        >
          Payment Records
        </Button>
        <Button 
          type={activeTab === 'reports' ? 'primary' : 'default'}
          icon={<FileTextOutlined />}
          onClick={() => setActiveTab('reports')}
        >
          Financial Reports
        </Button>
        <Button 
          type={activeTab === 'employees' ? 'primary' : 'default'}
          icon={<TeamOutlined />}
          onClick={() => setActiveTab('employees')}
        >
          Employee Management
        </Button>
      </nav>

      <div className="stats-cards">
        <Card className="stat-card">
          <Statistic
            title="Total Water Intake"
            value={waterIntake}
            suffix="liters"
            prefix={<DropboxOutlined />}
          />
        </Card>
        <Card className="stat-card">
          <Statistic
            title="Total Amount Spent"
            value={totalSpent}
            prefix="GH₵"                
          />
        </Card>
        <Card className="stat-card">
          <Statistic
            title="Pending Payments"
            value={pendingPayments}
            prefix="GH₵"  
          />
        </Card>
        <Card className="stat-card">
          <Statistic
            title="Inventory Items"
            value={inventoryData.length}
            prefix={<BarChartOutlined />} 
          />
        </Card>
      </div>

      {activeTab === 'inventory' && (
        <div className="tab-content">
          <div className="table-header">
            <h2>Inventory Records</h2>
            <Button type="primary" onClick={handleAddRecord}>
              Add New Record
            </Button>
          </div>
          <Table 
            columns={inventoryColumns} 
            dataSource={filteredInventoryData} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="tab-content">
          <div className="table-header">
            <h2>Payment Records</h2>
          </div>
          <Table 
            columns={paymentColumns} 
            dataSource={filteredPaymentData} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="tab-content">
          <h2>Financial Reports</h2>
          <div className="reports-placeholder">
            <p>Monthly expenditure reports would be generated here</p>
            <p>Inventory vs payment analysis charts</p>
            <p>Supplier payment history</p>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="tab-content">
          <h2>Employee Management</h2>
          <div className="employees-placeholder">
            <p>Employee records and payroll management would appear here</p>
            <p>Attendance tracking</p>
            <p>Leave management</p>
          </div>
        </div>
      )}

      <Modal
        title={currentRecord ? "Edit Inventory Record" : "Add New Inventory Record"}
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Record Type"
            rules={[{ required: true, message: 'Please select record type' }]}
          >
            <Select placeholder="Select record type">
              <Option value="water">Water Intake</Option>
              <Option value="shrink_wrap">Shrink Wrap</Option>
              <Option value="labels">Labels</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please input quantity' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unit"
            initialValue="liters"
            rules={[{ required: true, message: 'Please input unit' }]}
          >
            <Select>
              <Option value="liters">Liters</Option>
              <Option value="rolls">Rolls</Option>
              <Option value="pieces">Pieces</Option>
              <Option value="kg">Kilograms</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amountPaid"
            label="Amount Paid (GH₵)"
            rules={[{ required: true, message: 'Please input amount' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="supplier"
            label="Supplier"
            rules={[{ required: true, message: 'Please input supplier name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="paymentStatus"
            label="Payment Status"
            initialValue="pending"
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="partially_paid">Partially Paid</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default HRDashboard;