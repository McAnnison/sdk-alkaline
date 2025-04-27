"use client";
import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, DatePicker, Image, Modal, Button } from 'antd';
import { StockOutlined, PieChartOutlined, FileImageOutlined, AlertOutlined } from '@ant-design/icons';
import '../../styles/dashboard.css';

const { RangePicker } = DatePicker;

function AdminDashboard() {
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // Removed unused selectedDateRange state
  const [previewImage, setPreviewImage] = useState({
    visible: false,
    title: '',
    url: ''
  });
  const [waterLevelAlert, setWaterLevelAlert] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('stockData')) || [];
    setStockData(savedData);
    setFilteredData(savedData);
    
    // Check for low water level in the latest entry
    if (savedData.length > 0) {
      const latestEntry = savedData[savedData.length - 1];
      if (parseInt(latestEntry.waterLevel) < 20) {
        setWaterLevelAlert(true);
      }
    }
  }, []);

  // Filter data based on date range
  const handleDateChange = (dates) => {
    // Removed setSelectedDateRange as selectedDateRange is unused
    
    if (!dates || dates.length !== 2) {
      setFilteredData(stockData);
      return;
    }
    
    const [start, end] = dates;
    const filtered = stockData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= start && itemDate <= end;
    });
    
    setFilteredData(filtered);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (filteredData.length === 0) return {};
    
    const summary = {
      totalProduction: 0,
      totalDispatch: 0,
      avgClosingStock: 0,
      minWaterLevel: Infinity,
      entries: filteredData.length
    };
    
    filteredData.forEach(item => {
      summary.totalProduction += parseInt(item.todaysProduction) || 0;
      summary.totalDispatch += parseInt(item.dispatch) || 0;
      
      const waterLevel = parseInt(item.waterLevel) || 0;
      if (waterLevel < summary.minWaterLevel) {
        summary.minWaterLevel = waterLevel;
      }
    });
    
    summary.avgClosingStock = filteredData.reduce((sum, item) => {
      return sum + (parseInt(item.closingStock) || 0);
    }, 0) / filteredData.length;
    
    return summary;
  };

  const summary = calculateSummary();

  // Columns for the data table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: 'Opening Stock',
      dataIndex: 'openingStock',
      key: 'openingStock',
      sorter: (a, b) => a.openingStock - b.openingStock,
    },
    {
      title: 'Production',
      dataIndex: 'todaysProduction',
      key: 'todaysProduction',
      sorter: (a, b) => a.todaysProduction - b.todaysProduction,
    },
    {
      title: 'Dispatch',
      dataIndex: 'dispatch',
      key: 'dispatch',
      sorter: (a, b) => a.dispatch - b.dispatch,
    },
    {
      title: 'Closing Stock',
      dataIndex: 'closingStock',
      key: 'closingStock',
      sorter: (a, b) => a.closingStock - b.closingStock,
    },
    {
      title: 'Water Level',
      dataIndex: 'waterLevel',
      key: 'waterLevel',
      render: (text) => (
        <span style={{ color: parseInt(text) < 20 ? 'red' : 'inherit' }}>
          {text}%
        </span>
      ),
      sorter: (a, b) => a.waterLevel - b.waterLevel,
    },
    {
      title: 'Images',
      key: 'images',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {record.selectedImage1 && (
            <FileImageOutlined 
              onClick={() => setPreviewImage({
                visible: true,
                title: 'Labels Left - ' + new Date(record.timestamp).toLocaleDateString(),
                url: URL.createObjectURL(record.selectedImage1)
              })}
              style={{ cursor: 'pointer' }}
            />
          )}
          {record.selectedImage2 && (
            <FileImageOutlined 
              onClick={() => setPreviewImage({
                visible: true,
                title: 'Shrink Wrap - ' + new Date(record.timestamp).toLocaleDateString(),
                url: URL.createObjectURL(record.selectedImage2)
              })}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-header">Stock Management Dashboard</h1>
      
      {waterLevelAlert && (
        <div className="alert-banner">
          <AlertOutlined style={{ color: 'red', marginRight: '8px' }} />
          Warning: Low water level detected in the latest entry!
        </div>
      )}
      
      <div className="filter-section">
        <RangePicker 
          onChange={handleDateChange} 
          style={{ marginBottom: '20px' }} 
        />
      </div>
      
      <div className="summary-cards">
        <Card>
          <Statistic
            title="Total Production"
            value={summary.totalProduction}
            prefix={<StockOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Dispatch"
            value={summary.totalDispatch}
            prefix={<StockOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Avg Closing Stock"
            value={Math.round(summary.avgClosingStock)}
            prefix={<PieChartOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Min Water Level"
            value={summary.minWaterLevel === Infinity ? 0 : summary.minWaterLevel}
            suffix="%"
            prefix={<PieChartOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Entries"
            value={summary.entries}
          />
        </Card>
      </div>
      
      <div className="data-table">
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="timestamp"
          pagination={{ pageSize: 10 }}
        />
      </div>
      
      <Modal
        visible={previewImage.visible}
        title={previewImage.title}
        footer={null}
        onCancel={() => setPreviewImage({ ...previewImage, visible: false })}
      >
        <Image src={previewImage.url} />
      </Modal>
      
      <div className="export-section">
        <Button type="primary" onClick={() => {
          // Export to CSV functionality would go here
          alert('Export functionality would be implemented here');
        }}>
          Export to CSV
        </Button>
      </div>
    </div>
  );
}

export default AdminDashboard;