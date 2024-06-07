import { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


function Login(props) {
    let { baseUrl } = props;
    const [email, setLoginEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [loggingIn, setLoggingIn] = useState(false)

    const navigate = useNavigate();

    function Login(e) {
        e.preventDefault();
        // Set initial error values to empty
        setEmailError("")
        setPasswordError("")
        logIn();
    }
    const logIn = () => {
        setLoggingIn(true);
        fetch(baseUrl + "auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(async response => {
                setLoggingIn(false);
                const status = response.status;
                if (status == 401 || status == 403) {
                    return window.alert("You do not have permission to procceed")
                }
                if (status == 404) {
                    return window.alert("Account Not Found")
                }
                if (status >= 500) {
                    throw new Error(status)
                }
                response = await response.json()
                if (response.token) {
                    sessionStorage.setItem("admin", JSON.stringify({ email, token: response.token, expiresIn: response.expiresIn }))
                    props.setLoggedIn(true)
                    props.setEmail(email)
                    navigate("/")
                } else {
                    window.alert("Wrong email or password")
                }
            })
            .catch(e => { console.log(e); window.alert("Fail to fetch"); setLoggingIn(false); })
    }
    return (
        <>
            <Container fluid={true} className="mt-5 p-4">
                <Row className="justify-content-md-center xs">
                    <Col xs={'auto'}>
                        <Form className="border rounded p-4" onSubmit={(e) => Login(e)}>
                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setLoginEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="justify-content-md-center">
                                <Button variant="primary" type="submit" disabled={loggingIn}>
                                    {loggingIn ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : "Login"}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;