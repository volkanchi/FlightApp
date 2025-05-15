import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Empty,
  Button,
  Form,
  Select,
} from "antd";
import FilterForm from "./Formlar/FilterForm";
import "./Anasayfa.css";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";
const Anasayfa = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false); 
  const [seats, setSeats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [chosenSeat, setChosenSeat] = useState({}); 
  const [userMail, setUserMail] = useState("");
  const [activeSeats, setActiveSeats] = useState([]);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/"); 
    
  };
  const showModal = (price, seatArr) => {
    setTotalAmount(price);
    setActiveSeats(seatArr || []);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserMail(user?.email || "");
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    try {
      const selectedSeats = activeSeats;
      const user = JSON.parse(localStorage.getItem("user"));
      const reservation_id = Math.random().toString(36).substring(2, 10);
      const user_id = user.userId;
      const customer_mail = user.email;
      setUserMail(user.email);

      for (const seatId of selectedSeats) {
        const seat = seats.find((s) => s.seat_id === seatId);
        if (seat) {
          await fetch(
            "https://v1.nocodeapi.com/onurbronz/google_sheets/XosgJnkHLSNUlGtk?tabId=Seats",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                row_id: seat.row_id,
                status: "false",
              }),
            }
          );

          await fetch(
            "https://v1.nocodeapi.com/onurbronz/google_sheets/XosgJnkHLSNUlGtk?tabId=Reservations",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify([
                [
                  reservation_id,
                  user_id,
                  customer_mail,
                  seat.flight_id,
                  seat.seat_id,
                  Number(totalAmount),
                ],
              ]),
            }
          );
        }
      }

      setIsModalOpen(false);
      setChosenSeat({});
      setFilteredFlights([]);
      setIsFiltered(false);
      fetchInfos();
    } catch (error) {
      console.error(
        "Koltuk güncellenemedi veya rezervasyon eklenemedi:",
        error
      );
    }
  };

  const fetchInfos = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch(
      "https://v1.nocodeapi.com/onurbronz/google_sheets/XosgJnkHLSNUlGtk?tabId=Flights",
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setFlights(result.data || []);
        setFilteredFlights([]);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      });
    fetch(
      "https://v1.nocodeapi.com/onurbronz/google_sheets/XosgJnkHLSNUlGtk?tabId=Seats",
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((result) => setSeats(result.data || []))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  const handleFilterChange = (filterValues) => {
    setIsFiltered(true); 
    let filtered = flights.filter((flight) => {
      return (
        (!filterValues.from || flight.from === filterValues.from) &&
        (!filterValues.to || flight.to === filterValues.to) &&
        (!filterValues.airline || flight.airline === filterValues.airline) &&
        (!filterValues.departure_date ||
          flight.departure_date === filterValues.departure_date)
      );
    });

    if (filterValues.is_direct) {
      filtered = filtered.filter(
        (flight) =>
          String(flight.is_direct).toLowerCase() === filterValues.is_direct
      );
    }

    if (filterValues.max_price) {
      filtered = filtered.filter(
        (flight) => Number(flight.price) <= Number(filterValues.max_price)
      );
    }

    setFilteredFlights(filtered);
  };

 return (
    <div className="anasayfa-container">
      {/* Sağ üst köşeye logout butonu */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="filter-section">
        <FilterForm flights={flights} onFilterChange={handleFilterChange} />
      </div>

      <Row gutter={[16, 16]} justify="center" className="card-row">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : !isFiltered ? (
          <Col>
            <Empty description="Uçuş aramak için filtreleri kullanın." />
          </Col>
        ) : filteredFlights.length === 0 ? (
          <Col>
            <Empty description="Sonuç bulunamadı." />
          </Col>
        ) : (
          filteredFlights.map((flight, idx) => {
            const flightSeats = seats.filter(
              (seat) => seat.flight_id === flight.flight_id
            );
            return (
              <Col xs={24} key={idx}>
                <Card
                  title={flight.flight_id}
                  className="flight-card"
                  bordered={false}
                  style={{ marginBottom: 16 }}
                >
                  {/* ... uçuş detayları ve koltuk seçim alanı ... */}

                  <div className="flight-actions">
                    <Form.Item label="Koltuk" name={`seat_${flight.flight_id}`}>
                      <Select
                        mode="multiple"
                        placeholder="Koltuk Seç"
                        value={chosenSeat[flight.flight_id] || []}
                        onChange={(value) =>
                          setChosenSeat((prev) => ({
                            ...prev,
                            [flight.flight_id]: value,
                          }))
                        }
                      >
                        {flightSeats.map((seat, idx) => (
                          <Select.Option
                            key={seat.seat_id || idx}
                            value={seat.seat_id}
                            disabled={
                              String(seat.status).toLowerCase() === "false"
                            }
                          >
                            {seat.seat_id}{" "}
                            {String(seat.status).toLowerCase() === "false"
                              ? "(Dolu)"
                              : ""}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Button
                      type="primary"
                      onClick={() =>
                        showModal(
                          flight.price *
                            (chosenSeat[flight.flight_id]?.length || 1),
                          chosenSeat[flight.flight_id]
                        )
                      }
                      disabled={
                        !chosenSeat[flight.flight_id] ||
                        chosenSeat[flight.flight_id].length === 0
                      }
                    >
                      Rezervasyon Yap
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
      <PaymentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handlePayment={handlePayment}
        totalAmount={totalAmount}
        chosenSeat={activeSeats}
        userMail={userMail}
      />
    </div>
  );
};

export default Anasayfa;
