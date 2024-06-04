import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


function Login(props) {
    // let { setLoggedIn, setEmail } = props;
    let { setUser } = props
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
        fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(r => r.json())
            .then(r => {
                setLoggingIn(false);
                if (r.token) {
                    sessionStorage.setItem("user", JSON.stringify({ email, token: r.token }))
                    props.setLoggedIn(true)
                    props.setEmail(email)
                    navigate("/")
                } else {
                    window.alert("Wrong email or password")
                }
            }).catch(e => { console.log(e); window.alert("Fail to fetch"); setLoggingIn(false); })
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

                            <Form.Group className="mb-4" controlId="register">
                                Don't have account.&ensp;
                                <Link to={"/register"}>Click here to register</Link>
                            </Form.Group>

                            <Form.Group className="justify-content-md-center">
                                <Button variant="primary" type="submit" disabled={loggingIn ? true : false}>
                                    Login
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