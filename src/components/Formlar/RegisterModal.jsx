import React from "react";
import { Button, Form, Input, Modal } from "antd";

const RegisterModal = ({ isModalOpen, setIsModalOpen, handleRegister }) => {
  return (
    <Modal
      title="Kayıt Ol"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item
          label="Ad"
          name="name"
          rules={[{ required: true, message: "Lütfen şifre girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Soyad"
          name="surname"
          rules={[{ required: true, message: "Lütfen şifre girin!" }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="E-posta"
          name="email"
          rules={[{ required: true, message: "Lütfen e-posta girin!" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: "Lütfen şifre girin!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Kayıt Ol
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
