const getAllInvoiceItemsAdmin = async () => {
  const res = await fetch(`/api/invoiceItems/all-courses/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });

  const { statistics, totalRevenuePage } = await res.json();
  return { statistics, totalRevenuePage };
};

const getAllInvoiceItemsInstructor = async () => {
  const res = await fetch(`/api/invoiceItems/all-courses/instructor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });

  const { statistics, totalRevenueInstructor } = await res.json();
  return { statistics, totalRevenueInstructor };
};

export { getAllInvoiceItemsAdmin, getAllInvoiceItemsInstructor };
