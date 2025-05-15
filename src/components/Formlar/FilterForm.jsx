import React from "react";
import { Form, Select, Button, DatePicker, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";


const FilterForm = ({ flights, onFilterChange }) => {
  const fromOptions = [...new Set(flights.map((flight) => flight.from))];
  const toOptions = [...new Set(flights.map((flight) => flight.to))];
  const airlineOptions = [...new Set(flights.map((flight) => flight.airline))];

  const handleFilterChange = (values) => {
    if (values.departure_date) {
      values.departure_date = values.departure_date.format("YYYY-MM-DD");
    }
    onFilterChange(values);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="filter-form">
      <Form layout="vertical" onFinish={handleFilterChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Kalkış" name="from">
              <Select placeholder="Kalkış Yeri Seç">
                {fromOptions.map((from, idx) => (
                  <Select.Option key={idx} value={from}>
                    {from}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Varış" name="to">
              <Select placeholder="Varış Yeri Seç">
                {toOptions.map((to, idx) => (
                  <Select.Option key={idx} value={to}>
                    {to}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Havayolu" name="airline">
              <Select placeholder="Havayolu Seç">
                {airlineOptions.map((airline, idx) => (
                  <Select.Option key={idx} value={airline}>
                    {airline}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Tarih" name="departure_date">
              <DatePicker
                placeholder="Kalkış Tarihi Seç"
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Aktarma" name="is_direct">
              <Select placeholder="Aktarma Durumu Seç">
                <Select.Option value="true">Direkt</Select.Option>
                <Select.Option value="false">Aktarmalı</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Fiyat (En fazla)" name="max_price">
              <Select placeholder="Fiyat Seç">
                {[500, 1000, 1500, 2000, 2500].map((price) => (
                  <Select.Option key={price} value={price}>
                    {price} TL
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} style={{ textAlign: "right" }}>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                Ara
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FilterForm;
