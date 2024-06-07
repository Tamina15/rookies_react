import { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
function App() {
    let [user, setUser] = useState({});
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" /*fixed="top"*/>
                <Container >
                    <Navbar.Brand as={Link} to={'/'}>Rookies Store</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to={'/products'}>Products</Nav.Link>
                            <Nav.Link as={Link} to={'/profile'}>Profile</Nav.Link>
                            <Nav.Link as={Link} to={'/orders'}>Orders</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <Container>
                    <Form inline="true">
                        <Row>
                            <Col xs="auto" md={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    className=" mr-sm-2"
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" variant="outline-success">Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
                <Container className='pe-5 gx-5 justify-content-end'>
                <Button className='mx-4' variant='outline-dark' as={Link} to={'/cart'}>
                <ShoppingCartOutlined />
                </Button>
                    {sessionStorage.user ?
                        <>
                            <Navbar.Text className='me-5'>
                                Signed in as : {JSON.parse(sessionStorage.user).email}
                            </Navbar.Text>
                            <Button as={Link} to={'/logout'}>Logout</Button>
                        </>
                        : <>
                            <Row className='flex-row gx-5 justify-content-end'>
                                <Col>

                                    <Button as={Link} to={'/login'} property=''>Login</Button>
                                </Col>
                                <Col>

                                    <Button as={Link} to={'/register'}>Register</Button>
                                </Col>
                            </Row>
                        </>
                    }

                </Container>
            </Navbar>
            <Container id='main'>
                <Outlet />
            </Container>
        </>
    );
}
export default App;