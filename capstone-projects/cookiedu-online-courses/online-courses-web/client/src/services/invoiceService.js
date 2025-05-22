const checkout= async(cartItems, paymentMethod)=>{
    try {
    const response = await fetch(`/api/invoices/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bear ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ cartItems, paymentMethod })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Lỗi xảy ra trong quá trình thanh toán.');
    }
    return data;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

const getMyCourse = async()=>{
    const res = await fetch("/api/invoices/my_course", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bear ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    return data;
};
export {checkout, getMyCourse}