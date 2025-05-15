import React, { useState } from "react";
import LoginForm from "./Formlar/LoginForm";
import RegisterModal from "./Formlar/RegisterModal";
import { useNavigate } from "react-router-dom";

const GirisEkrani = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  const onFinish = (values) => {
    const email = values.email.trim().toLowerCase(); 
    const password = values.password;
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    fetch(`https://v1.nocodeapi.com/onurbronz/google_sheets/XosgJnkHLSNUlGtk/search?tabId=Users&searchKey=email&searchValue=${email}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Cevap verisi:", data); 
  
        const user = data[0];
  
        if (user) {
          const storedPassword = user.password;
          if (storedPassword === password) {
            const userInfo = {
              userId: user.user_id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              role: user.role,
            };
  
            localStorage.setItem("user", JSON.stringify(userInfo));
            navigate("/anasayfa");
          } else {
            alert("Şifre hatalı");
          }
        } else {
          alert("Kullanıcı bulunamadı");
        }
      })
      .catch((error) => {
        console.error("Giriş hatası:", error);
        alert("Bir hata oluştu.");
      });
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showRegisterModal = () => {
    setIsModalOpen(true);
  };
  
  const handleRegister = async (values) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const userId = "U" + Math.floor(100000 + Math.random() * 900000);
      const payload = [
        [
          userId,
          values.name,
          values.surname,
          values.email,
          values.password,
          "user",
        ],
      ];

      var requestOptions = {
        method: "post",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(payload),
      };

      await fetch(
        "https://v1.nocodeapi.com/onurbronz/google_sheets/XosgJnkHLSNUlGtk?tabId=Users",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
      console.log("Kayıt Bilgileri:", values);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Kayıt sırasında bir hata oluştu:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",

          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 600 }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "48px",
              fontWeight: "bold",
              color: "black",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
              
            }}
          >
            FlightApp
          </h1>
          <LoginForm
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            showRegisterModal={showRegisterModal}
          ></LoginForm>
          <RegisterModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleRegister={handleRegister}
          ></RegisterModal>
        </div>
      </div>
    </div>
  );
};

export default GirisEkrani;
