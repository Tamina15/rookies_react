import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Outlet } from 'react-router-dom';
function App() {
    return (<>
        <>
            <Nav variant="tabs" defaultActiveKey="/home" className='mt-3'>
                <Nav.Item>
                    <Nav.Link as={Link} to="/">Product</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/users">Users</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                </Nav.Item>
            </Nav>
            <Container id='main'>
                <Outlet></Outlet>
            </Container>
        </>
    </>);
}

export default App;