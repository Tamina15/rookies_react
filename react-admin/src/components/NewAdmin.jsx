import { useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NewAdmin(props) {
    const { baseUrl, token } = props
    let [admin, setAdmin] = useState({})

    let [error, setError] = useState(false);

    let [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function updateFields(name, value) {
        setAdmin(a => ({ ...admin, [name]: value }))
    }
    async function saveAdmin(e) {
        e.preventDefault();
        setLoading(true);
        const result = await fetch(baseUrl + "users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(admin)
        }).then(async response => {
            const data = await response.json();
            if (response.status >= 500) { setError(true); window.alert("Error", JSON.parse(data).message) }
            if (response.status === 401 || response.status === 403) { window.alert("Forbidden"); navigate('/login') }
            if (response.status === 409) { setError(true); window.alert("User already exsist"); }
            if (response.status === 201) {
                window.alert("Create Admin Succesfully")
            }
        }).catch(e => { setLoading(false); setError(true); console.log(e); window.alert("Error: " + e); })
        setLoading(false)
    }

    return (<>
        <Container className="mt-5" style={{ "maxWitdh": "500px" }}>
            <h3 className="mb-3">New Admin</h3>
            <Form onSubmit={(e) => { saveAdmin(e) }}>
                <Form.Group className="mb-3" controlId="Email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required={true} minLength={1} maxLength={255} placeholder="Enter Email" onChange={(e) => { updateFields("email", e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="Username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" required={true} minLength={1} maxLength={255} placeholder="Enter Username" onChange={(e) => { updateFields("username", e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="Password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required={true} minLength={1} maxLength={255} placeholder="Enter Password" onChange={(e) => { updateFields("password", e.target.value) }} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    /> : "Submit"}

                </Button>
            </Form>
        </Container>
    </>);
}

export default NewAdmin;