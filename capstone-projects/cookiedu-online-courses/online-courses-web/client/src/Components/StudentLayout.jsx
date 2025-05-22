import { useContext, useEffect } from "react";
import { Nav, Button } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";
import { getCart } from "../services/cartsService";

const StudentLayout = () => {
  const { cartItems, setCartItems, itemCount, setItemCount } =
    useContext(CartContext);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCart();
        if (data) {
          setCartItems(data.courseDetails);
          const count = data.courseDetails.length;
          setItemCount(count); // Cập nhật số lượng mặt hàng
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [setCartItems, setItemCount]);

  return (
    <>
      <Nav.Item>
        <Nav.Link href="/list-courses">List Courses</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/my-course">My Course</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Button className="btn-light me-2" href="/cart">
          <i className="fa fa-shopping-cart me-1" aria-hidden="true"></i>
          Cart
          <span className="badge bg-danger ms-1">{itemCount}</span>
        </Button>
      </Nav.Item>
    </>
  );
};

export default StudentLayout;
