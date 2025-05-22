import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import CartItemCheckout from "../../Components/CartItemCheckout";
import "./styles/CheckoutPage.css"; 
import { checkout } from "../../services/invoiceService";
import { getCart } from "../../services/cartsService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CheckoutPage = () => {
    const { cartItems } = useContext(CartContext);
    const { setCartItems } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(0);
    const { setItemCount } = useContext(CartContext);
    const navigate = useNavigate();
    const PaymentMethod = {
      MOMO: "MoMo",
      PAYPAL: "PayPal",
    };
    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const updatedCart = await getCart(); 
        setCartItems(updatedCart.courseDetails);
        const total = updatedCart.courseDetails.reduce(
          (acc, item) => acc + item.course.price,
          0
        );
        setTotalPrice(total); 
      } catch (error) {
        console.error("Failed to fetch cart data: ", error);
      }
    };
    const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method); 
    };
    const handleCheckout = async () => {
      
      try {
        if (!paymentMethod) {
          toast.error("Please select payment method");
          return;
        }      
        const updatedCart = await getCart();
        setCartItems(updatedCart.courseDetails); 
        const data = await checkout(updatedCart.courseDetails, paymentMethod);
        toast.success("Payment successfully");
        setItemCount(0);
        navigate("/my-course");
      } catch (error) {
        toast.error("Payment failed " + error.message);
      }
    };

  return (
    <Container className="center-content" style={{ minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Row className="justify-content-md-center">
        <Col md={12}>
          <h2
            className="header"
            style={{ fontSize: "40px", fontWeight: "bold" }}
          >
            Checkout
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>
                <h2 style={{ fontSize: "30px", fontWeight: "bold" }}>
                  Payment Method
                </h2>
              </Card.Title>
              <Form>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    id="momo"
                    name="paymentMethod"
                    label={
                      <div className="payment-method">
                        <Image
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png"
                          rounded
                          className="payment-icon"
                        />
                        MoMo
                      </div>
                    }
                    checked={paymentMethod === "MOMO"}
                    onChange={() => handlePaymentMethodChange("MOMO")}
                  />
                  <Form.Check
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    label={
                      <div className="payment-method">
                        <Image
                          src="https://cdn.icon-icons.com/icons2/1195/PNG/512/1490889684-paypal_82515.png"
                          rounded
                          className="payment-icon"
                        />
                        PayPal
                      </div>
                    }
                    checked={paymentMethod === "PAYPAL"}
                    onChange={() => handlePaymentMethodChange("PAYPAL")}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>
                <h2 style={{ fontSize: "30px", fontWeight: "bold" }}>
                  Order Details
                </h2>
              </Card.Title>
              <Form>
                {cartItems.map((cartItem) => (
                  <Row key={cartItem._id} className="mb-4">
                    <CartItemCheckout cartItem={cartItem} />
                  </Row>
                ))}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="sticky-top" style={{ top: 20 }}>
            <Card.Body>
              <div className="container text-center">
                <div
                  className="total-price-label"
                  style={{ fontSize: "40px", fontWeight: "bold" }}
                >
                  <span>Total Price</span>
                </div>
                <div
                  className="total-price-value"
                  style={{ fontSize: "40px", fontWeight: "bold" }}
                >
                  ${totalPrice.toFixed(2)}
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleCheckout}
                  className="w-100"
                >
                  Complete Payment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
