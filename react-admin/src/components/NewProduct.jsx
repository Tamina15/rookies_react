import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NewProduct(props) {
    const { baseUrl, token } = props
    const [product, setProduct] = useState({ feature: false });

    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(false);

    function changeProductInfo(name, value) {
        setProduct(p => ({ ...p, [name]: value }))
    }
    let navigate = useNavigate();

    async function addProduct(e) {
        e.preventDefault();
        if (product.name == undefined) {
            window.alert("Please Enter Product Name");
            return document.getElementById("input_name").focus();
        }
        if (product.description == undefined) {
            window.alert("Please Enter Product Description");
            return document.getElementById("input_description").focus();
        }
        if (product.price == undefined) {
            window.alert("Please Enter Product Price");
            return document.getElementById("input_price").focus();

        }
        if (product.amount == undefined) {
            window.alert("Please Enter Product Amount");
            return document.getElementById("input_amount").focus();
        }
        
        setLoading(true);
        
        const result = await fetch(baseUrl + "products", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            }, body: JSON.stringify(product)
        }).then(async response => {
            const data = await response.json();
            if (response.status >= 500) { setError(true); window.alert("Error", JSON.parse(data).message) }
            if (response.status === 401 || response.status === 403) { window.alert("Forbidden"); navigate('/login') }
            if (response.status === 409) { setError(true); window.alert("409"); }
            if (response.status === 200) {
                setProduct(p => ({ ...p, ...data }));
                console.log(data);
                window.alert("Add Product Successfully");
                navigate('/products')
            }
        }).catch(e => { setLoading(false); setError(true); console.log(e); window.alert("Error: " + e); })
        setLoading(false);
    }

    return (<>
        <Container className="mt-5">
            <h3 className="mb-3">
                Add Product
            </h3>
            <Form onSubmit={(e) => addProduct(e)}>
                <Form.Group className="mb-3" id="name">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" id="input_name" placeholder="Product Name" required autoFocus minLength={1} maxLength={255} onChange={(e) => changeProductInfo("name", e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" id="description">
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control as="textarea" id="input_description" placeholder="Product Description" rows={3} minLength={1} maxLength={255} onChange={(e) => changeProductInfo("description", e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" id="price">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control type="number" id="input_price" placeholder="Product Price" min={1} onChange={(e) => changeProductInfo("price", e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" id="amount">
                    <Form.Label>Product Amount</Form.Label>
                    <Form.Control type="number" id="input_amount" placeholder="Product Amount" min={1} onChange={(e) => changeProductInfo("amount", e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" id="feature">
                    <Form.Label>Product Feature</Form.Label>
                    <Form.Check type="switch" defaultChecked={false} id="feature" onChange={(e) => { console.log(e.target.checked); changeProductInfo("feature", e.target.checked) }} />
                </Form.Group>
                <Form.Group className="mb-3" id="submit">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> : "Add Product"}
                    </Button>
                </Form.Group>
            </Form>
        </Container>
    </>);
}

export default NewProduct;