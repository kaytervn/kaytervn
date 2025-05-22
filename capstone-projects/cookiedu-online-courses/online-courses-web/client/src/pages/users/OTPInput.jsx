import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import OtpInput from "react-otp-input";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { checkOTPUser } from "../../services/usersService";
import Alert from "../../Components/Alert";
import { Modal } from "react-bootstrap";
import logo from "../../../images/cookiedu_logo.png";
import successImg from "../../../images/success.png";

const OTPInput = () => {
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [otp, setOTP] = useState("");
    const { user } = useContext(UserContext);
    const [showSuccessVerify, setShowSuccessVerify] = useState(false);
    console.log(user.email);
    // console.log(otp)
    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await checkOTPUser(user.email, otp);
            setShowSuccessVerify(true);
        } catch (err) {
            setError(err.message);
        }

    };

    const confirm = () => {
        navigate("/login");
    };

    return (
        <Container className="p-4 shadow">
            <Row>
                <Col
                    md="7"
                    className="text-center text-md-start d-flex flex-column justify-content-center"
                >
                    <h1 className="my-5 display-3 fw-bold ls-tight text-info-emphasis px-3">
                        Verify Your Account <br />
                        <span className="text-dark-emphasis h4">
                            The OTP code sent through{" "}
                            <span className="text-warning fw-bold">{user.email}</span>
                        </span>
                    </h1>

                    <div style={{ textAlign: "center" }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ maxWidth: "50%", maxHeight: "300px" }}
                        />
                    </div>
                </Col>

                <Col md="4">
                    <Card
                        className="d-flex align-items-center justify-content-center"
                        style={{ marginTop: "15%" }}
                    >
                        <Card.Body className="p-5 shadow">
                            <Row>
                                <h4 className="d-flex justify-content-center text-align center mb-4">
                                    OTP Code
                                </h4>
                            </Row>
                            <Row>
                                <OtpInput
                                    value={otp}
                                    onChange={(newOtp) => setOTP(newOtp)}
                                    numInputs={6}
                                    renderSeparator={<span> </span>}
                                    inputType="tel"
                                    containerStyle={{ display: "unset" }}
                                    inputStyle={{ width: "3rem", height: "3.5rem" }}
                                    renderInput={(props) => (
                                        <input {...props} className="otp-input" />
                                    )}
                                />
                                <div className="btn-container d-flex justify-content-center mt-5">
                                    <button
                                        className="btn btn-outline-success"
                                        onClick={handleVerify}
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                                {error && <Alert msg={error} type="error" />}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showSuccessVerify} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">
                        Verify account is successfully
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: "center" }}>
                        <img
                            src={successImg}
                            alt="Successfully updated"
                            style={{ maxWidth: "30%", maxHeight: "300px" }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center text-align-center">
                    <Button variant="success" onClick={confirm}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OTPInput;
