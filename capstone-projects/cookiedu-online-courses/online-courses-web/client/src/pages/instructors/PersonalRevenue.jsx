import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "../../Components/Alert";

import DataTable, {
  Alignment,
  createTheme,
  defaultThemes,
} from "react-data-table-component";

import { customStyles } from "../../Components/customStyles/datatableCustom";

import { StatisticsInstructorContext } from "../../contexts/StatisticsIntructorContext";
import { getAllInvoiceItemsInstructor } from "../../services/InvoiceItemService";

const PersonalRevenue = () => {
  const { statisticsInstructor, setStatisticsInstructor } = useContext(
    StatisticsInstructorContext
  );
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setTimeout(async () => {
      const statistics = await getAllInvoiceItemsInstructor();
      console.log(statistics);
      setStatisticsInstructor({
        listStatistics: statistics.statistics,
        totalRevenueInstructor: statistics.totalRevenueInstructor,
      });
    }, 0);
  }, []);

  const columns = [
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
      textAlign: "center",
    },
    {
      name: "Enrollments",
      selector: (row) => row.totalBuyers,
      sortable: true,
    },
    {
      name: "Subtotal Revenue",
      selector: (row) => row.totalRevenue,
      sortable: true,
    },
  ];

  return (
    <Container>
      <h1 className="mt-3 mb-3"> Personal Revenue </h1>

      {success && <Alert msg={success} type="success" />}
      {error && <Alert msg={error} type="error" />}
      <div className="text-end mb-3 mt-3">
        <div className="input-group news-input">
          <span className="input-group-text">
            <i className="fa fa-search" aria-hidden="true"></i>
          </span>
          <input
            type="text"
            className="form-control"
            id="searchInput"
            placeholder="Search..."
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={statisticsInstructor.listStatistics}
        fixedHeader
        pagination
        customStyles={customStyles}
      ></DataTable>
      <h2 className="text-end mt-3">
        My Total Revenue: 💲{statisticsInstructor.totalRevenueInstructor}
      </h2>
    </Container>
  );
};

export default PersonalRevenue;
