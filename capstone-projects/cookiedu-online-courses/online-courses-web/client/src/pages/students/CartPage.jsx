import React, { useContext, useEffect, useState } from "react";
import { getCart } from "../../services/cartsService";
import CartItem from "../../Components/CartItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import { CartContext } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const { setItemCount } = useContext(CartContext);
  const [isEmptyCart, setIsEmptyCart] = useState(false);
  const [canCheckout, setCanCheckout] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getCart();
      if (data) {
        setCartItems(data.courseDetails);
        updateTotalPrice(data.courseDetails);
        if (data.courseDetails.length === 0) {
          setCanCheckout(false);
        } else {
          setCanCheckout(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  console.log("item:" , cartItems)
  const updateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.course.price, 0);
    setTotalPrice(total);
  };

  const handleRemoveItem = (courseId) => {
    const updatedItems = cartItems.filter(
      (item) => item.course._id !== courseId
    );
    setCartItems(updatedItems);
    updateTotalPrice(updatedItems);
    setItemCount(updatedItems.length);

    if (updatedItems.length === 0) {
      setIsEmptyCart(true);
      setCanCheckout(false);
    } else {
      setIsEmptyCart(false);
      setCanCheckout(true);
    }

    toast.success("Removed successfully!", { autoClose: 3000 });
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 5 }}
      >
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>Removed successfully!</Toast.Body>
      </Toast>
      <h2 className="my-4">Cart Items</h2>
      <Row>
        <Col md={8}>
          {isEmptyCart ? (
            <p>There are no courses in the cart</p>
          ) : (
            cartItems.map((cartItem) => (
              <Row key={cartItem._id} className="mb-4">
                <CartItem cartItem={cartItem} onRemove={handleRemoveItem} />
              </Row>
            ))
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <Card.Text>
                Total Price: <strong>${totalPrice.toFixed(2)}</strong>
              </Card.Text>
              <Link to={canCheckout ? "/checkout" : "#"}>
                <Button
                  variant="primary"
                  block
                  onClick={() => {
                    if (!canCheckout) {
                      toast.warn("Bạn không có sản phẩm để thanh toán");
                    }
                  }}
                  disabled={!canCheckout}
                >
                  Checkout
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
