import Nav from "react-bootstrap/Nav";
const InstructorLayout = () => {
  return (
    <>
      <Nav.Item>
        <Nav.Link href="/create-course">Create Course</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/personal-revenue">Personal Revenue</Nav.Link>
      </Nav.Item>
    </>
  );
};

export default InstructorLayout;
