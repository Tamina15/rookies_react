import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Register(props) {
    let { baseUrl } = props
    const [registering, setRegistering] = useState(false)
    const [newUser, setNewUser] = useState({ email: '' });
    const navigate = useNavigate();

    function setUserField(name, e) {
        setNewUser(n => ({ ...n, [name]: e.target.value }))
    }
    async function register(e) {
        e.preventDefault();
        console.log(newUser);
        setRegistering(true);
        const result = await fetch(baseUrl + 'auth/signup', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        }).then(r => r.json())
        .then(r => {
            setRegistering(false);
            if (r.token) {
                sessionStorage.setItem("user", JSON.stringify({ email: newUser.email, token: r.token }))
                props.setLoggedIn(true)
                props.setEmail(newUser.email)
                navigate("/")
            } else {
                window.alert("Email has been used")
            }
        }).catch(e => { console.log(e); window.alert("Fail to fetch"); navigate('/error') })
    }
    return (<>
        <Container fluid={true} className="mt-5 p-4">
            <Row className="justify-content-md-center xs">
                <Col xs={'auto'}>
                    <Form className="border rounded p-4" onSubmit={(e) => { register(e) }}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label className="required-field">Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => { setUserField('email', e); }} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="required-field">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { setUserField('password', e); }} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className="required-field">Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" onChange={(e) => { setUserField('username', e); }} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control type="text" placeholder="Enter firstname" onChange={(e) => { setUserField('firstname', e); }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control type="text" placeholder="Enter lastname" onChange={(e) => { { setUserField('lasname', e); } }} />
                        </Form.Group>
                        <Form.Control plaintext readOnly defaultValue="Required Field *" className="required-field form-text  red-word" />


                        <Form.Group className="mb-3" controlId="register">
                            Already have an account.&ensp;
                            <Link to={"/login"}>Click here to login</Link>
                        </Form.Group>

                        <Form.Group className="justify-content-md-center">
                            <Button variant="primary" type="submit" disabled={registering ? true : false}>
                                Register
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    </>);
}

export default Register;