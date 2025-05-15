import React, { useState } from "react";
import { Modal, Button, Typography, Input, message } from "antd";
const { Title } = Typography;

const PaymentModal = ({
  isModalOpen,
  setIsModalOpen,
  handlePayment,
  totalAmount,
  chosenSeat,
  userMail,
}) => {
  const [paymentCode, setPaymentCode] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const onPayment = async () => {
    await handlePayment(paymentCode);
    messageApi.open({
      type: "success",
      content: `Bilet bilgileri ${userMail} adresine gönderildi.`,
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Ödeme"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Vazgeç
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onPayment}
            disabled={paymentCode.length !== 8}
          >
            Ödemeyi Tamamla
          </Button>,
        ]}
      >
        <p>
          Toplam Tutar: <b>{totalAmount} TL</b>
        </p>
        <p>
          Seçilen Koltuklar: <b>
            {Array.isArray(chosenSeat) && chosenSeat.length > 0
              ? chosenSeat.join(", ")
              : "-"}
          </b>
        </p>
        <Title level={5}>Ödeme Bilgilerini Giriniz</Title>
        <Input.OTP
          length={8}
          value={paymentCode}
          onChange={(val) => {
            setPaymentCode(val.replace(/\D/g, ""));
          }}
          inputType="numeric"
          style={{ width: "100%" }}
        />
      </Modal>
    </>
  );
};

export default PaymentModal;
