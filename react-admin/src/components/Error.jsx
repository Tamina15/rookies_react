import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useRouteError } from "react-router-dom";

function Error() {
    const navigate = useNavigate()
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="--bs-danger">
                Error
            </h1>
            <br></br>
            <h4> <Link to={'/'}>
                Back To Main Page
            </Link>
            </h4>
        </Container>
    );
}

export default Error;