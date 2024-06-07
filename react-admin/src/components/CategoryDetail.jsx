import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

const tableHeader = ['ID', 'Name', "Action"]

function CategoryDetail(props) {
    const { baseUrl, token } = props
    const { categoryId } = useParams();
    const [category, setCategory] = useState({})

    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getCategory();
    }, [])

    async function getCategory() {
        setLoading(true);
        const result = await fetch(baseUrl + "categories/" + categoryId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            const data = await response.json();
            if (response.status >= 500) { setError(true); window.alert("Error", JSON.parse(data).message) }
            if (response.status === 401 || response.status === 403) { window.alert("Forbidden"); navigate('/login') }
            if (response.status === 409) { setError(true); window.alert("409"); }
            if (response.status === 200) {
                setCategory(data);
                console.log(data);
            }
        }).catch(e => { setLoading(false); setError(true); console.log(e); window.alert("Error: " + e); })
        setLoading(false)
    }

    async function removeProduct(e) {
        const product_id = e.target.value;
        const result = await fetch()
    }

    function changeCategoryInfo(name, e) {
        setCategory(c => ({ ...c, [name]: e }));
    }

    async function updateCategory(e) {
        setLoading(true)
        e.preventDefault();
        const body = { id: category.id, name: category.name, description: category.description }
        const result = await fetch(baseUrl + 'categories', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            }, body: JSON.stringify(body)
        }
        ).then(async response => {
            const data = await response.json();
            if (response.status >= 500) { setError(true); window.alert("Error", JSON.parse(data).message) }
            if (response.status === 401 || response.status === 403) { window.alert("Forbidden"); navigate('/login') }
            if (response.status === 409) { setError(true); window.alert("409"); }
            if (response.status === 200) {
                setCategory(c => ({ ...c, ...data }));
                console.log(data);
            }
        }).catch(e => { setLoading(false); setError(true); console.log(e); window.alert("Error: " + e); })
        setLoading(false)
    }


    return (<>
        <Container className="mt-5">
            <h3 className="mb-3">
                Category Detail
            </h3>
            <Form className="border rounded p-4" onSubmit={e => { updateCategory(e) }}>
                <Form.Group className="mb-3" controlId="label">
                    <Form.Label>Category ID</Form.Label>
                    <br></br>
                    <h4>
                        {category.id}
                    </h4>
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control type="text" placeholder="Category Name" defaultValue={category.name} onChange={(e) => { changeCategoryInfo("name", e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Category Description</Form.Label>
                    <Form.Control type="text" placeholder="Category Description" defaultValue={category.description} onChange={(e) => { changeCategoryInfo("description", e.target.value) }} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    /> : "Edit"}
                </Button>
            </Form>
            <h3 className="mt-3"> Associated Products</h3>
            <Table striped bordered hover size="sm" className="mt-3" style={{ "max-width": "500px" }}>
                <thead>
                    <tr>
                        {tableHeader.map((header) => (
                            <th key={header} >{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {category.products && category.products.map((product, index) => (
                        <tr className="align-middle">
                            <td style={{ "width": "100px" }} key={product.id}> {product.id}</td>
                            <td style={{ "width": "100px" }}> {product.name}</td>
                            <td style={{ width: "100px" }}><Container className="justify-content-center d-flex flex-col">
                                <Button className="m-3 btn-primary" key={"edit_" + product.id} as={Link} to={'/products/' + product.id}>Go to</Button>
                                {/* <Button className="m-3 btn-danger" key={"edit_" + product.id} value={product.id} onClick={(e) => { removeProduct(e) }}>Remove</Button> */}
                            </Container>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    </>);
}

export default CategoryDetail;