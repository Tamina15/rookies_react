import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Profile(props) {
    const { email, baseUrl, loggedIn } = props
    let token = JSON.parse(sessionStorage.getItem('user')).token;
    const [user, setUser] = useState({})
    let address;
    const navigate = useNavigate()
    async function getUser() {
        const result = await fetch(baseUrl + "users/info", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            if (response.status >= 500) {
                throw new Error()
            }
            if (response.status >= 401) {
                navigate('/login')
            }
            const u = await response.json();
            setUser(u);
            address = u.address
            console.log(u);
        }).catch(e => {
            console.log(e)
        })
    }
    useEffect(() => {
        if (!loggedIn)
            navigate('/login')
        getUser();
    }, [])

    function setUserField(name, e) {
        setUser(n => ({ ...n, [name]: e.target.value }))
    }
    function changeInfo(e) {

    }

    return (<Container className="m-5">
        <Row>
            <Col md={4}>
                <Image src="" roundedCircle  className="border rounded"></Image>
            </Col>
            <Col md={8} >
                <Container className="d-flex justify-content-center">
                    <Form className="border rounded p-4" style={{ width: "100%" }} onSubmit={(e) => { changeInfo(e) }}>
                        <legend>User Infomation</legend>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label >Email</Form.Label>
                            <Form.Control type="email" defaultValue={user.email} onChange={(e) => { setUserField('email', e); }} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label >Username</Form.Label>
                            <Form.Control type="text" defaultValue={user.username} onChange={(e) => { setUserField('username', e); }} required />
                        </Form.Group>
                        <Row>

                        <Form.Group as={Col} className="mb-3" controlId="firstName">
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control type="text" defaultValue={user.firstname} onChange={(e) => { setUserField('firstname', e); }} />
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3" controlId="lastName">
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                        </Form.Group>
                        </Row>
                        <legend>More Detail</legend>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Gender</Form.Label>
                            <br></br>
                            <Form.Check
                                inline
                                label="Male"
                                name="group1"
                                type='radio'
                                id={"male"}
                                defaultChecked={user.gender}
                            />
                            <Form.Check
                                inline
                                label="Female"
                                name="group1"
                                type='radio'
                                id={"female"}
                                defaultChecked={!user.gender}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Age</Form.Label>
                            <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Address Number</Form.Label>
                            <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                        </Form.Group>
                        <Row>

                            <Form.Group as={Col} className="mb-3" controlId="lastName">
                                <Form.Label>Street</Form.Label>
                                <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="lastName">
                                <Form.Label>Ward</Form.Label>
                                <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="lastName">
                                <Form.Label>District</Form.Label>
                                <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="lastName">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="lastName">
                                <Form.Label>Province</Form.Label>
                                <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="lastName">
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" defaultValue={user.lastname} onChange={(e) => { { setUserField('lasname', e); } }} />
                            </Form.Group>
                        </Row>
                        <Button>Change Info</Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    </Container>);
}

export default Profile;