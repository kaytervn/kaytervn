import { useContext, useEffect, useState } from "react";
import { UsersContext } from "../../contexts/UsersContext";
import {
  changeUserStatus,
  getUserListByRole,
} from "../../services/usersService";
import Role from "../../../../models/RoleEnum";
import Container from "react-bootstrap/Container";
import Alert from "../../Components/Alert";

import DataTable, {
  Alignment,
  createTheme,
  defaultThemes,
} from "react-data-table-component";
import FormCheckInput from "react-bootstrap/FormCheckInput";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import AdminNavBar from "../../Components/AdminNavBar";
import { Table } from "react-bootstrap";
import { customStyles } from "../../Components/customStyles/datatableCustom";

import Image from "react-bootstrap/esm/Image";
import { StatisticsContext } from "../../contexts/StatisticsContext";
import { getAllInvoiceItemsAdmin } from "../../services/InvoiceItemService";

import "react-datepicker/dist/react-datepicker.css";
import { getAllCourseAdmin } from "../../services/coursesService";
const RevenueStatistic = () => {
  const { statistics, setStatistics } = useContext(StatisticsContext);

  useEffect(() => {
    setTimeout(async () => {
      const statistics = await getAllInvoiceItemsAdmin();
      setStatistics({
        listStatistics: statistics.statistics,
        totalRevenuePage: statistics.totalRevenuePage,
      });
    }, 0);
  }, []);

  const columns = [
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
      // width: "200px",
      textAlign: "center",
    },
    {
      name: "Instructor Name",
      selector: (row) => row.instructorName,
      sortable: true,
      // width: "200px",
      textAlign: "center",
    },
    {
      name: "Total Buyers",
      selector: (row) => row.totalBuyers,
      sortable: true,
    },
    {
      name: "Total Revenue",
      selector: (row) => row.totalRevenue,
      sortable: true,
    },
  ];

  async function handleSearch(e) {
    var total = 0;
    const newStatics = (await getAllInvoiceItemsAdmin()).statistics.filter(
      (course) =>
        course.courseName
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        course.instructorName
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
    );
    newStatics.forEach((course) => {
      total += course.totalRevenue;
    });
    setStatistics({ listStatistics: newStatics, totalRevenuePage: total });
  }

  return (
    <Row className="ms-(-6) me-0">
      <Col md={3}>
        <AdminNavBar />
      </Col>
      <Col md={8}>
        <Container>
          <h1 className="mt-3 mb-3"> Revenue Statistics </h1>

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
                onChange={handleSearch}
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={statistics.listStatistics}
            fixedHeader
            pagination
            customStyles={customStyles}
          ></DataTable>
          <h2 className="text-end mt-3">
            {" "}
            Sum Revenue: {statistics.totalRevenuePage}💲{" "}
          </h2>
        </Container>
      </Col>
    </Row>
  );
};

export default RevenueStatistic;
