// import { Row } from "antd";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { default as Pagination } from './Pagination'
import { Link, useNavigate } from "react-router-dom";


const tableHeader = ['ID', 'Name', 'Description', 'Amount', 'Price', 'Rating', 'Category', 'Feature', "Created At", "Updated At", "Action"]

function Products(props) {
    const { baseUrl, feature, token } = props;
    const [products, setProducts] = useState([]);

    let [total, setTotal] = useState(0);
    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    let navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = (e) => { setShow(true) };

    const getProducts = async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            if (response.status === 401 || response.status === 403) { return navigate('/login') }
            if (response.status > 500) {
                { console.error(e.status); setError(true); throw new Error }
            }
            let data = await response.json();
            console.log(data);
            setProducts(data.products);
            setTotal(data.count);
            setLoading(false);
        }).catch((e) => { console.error(e.status); setError(true); });

    };

    useEffect(() => {
        getProducts(baseUrl + 'products?sortBy=id');
    }, []);

    if (error) {
        // setError(false);
        // return (<div>Error Getting Products</div>);
        navigate('/error')
    }
    function changePage(page, pageSize) {
        console.log(page, pageSize);
        getProducts(baseUrl + "products?" + "page=" + (page - 1) + "&" + "limit=" + (pageSize) + "&" + "sortBy=" + "id" + "&" + (feature ? 'featured=true' : '')).catch((e) => { console.error(e); setError(true); });
    }

    async function deleteProduct(e, hard) {
        e.preventDefault();
        setLoading(true)
        let product_id = e.target.value;
        let text = "Delete Product. Press Comfirm to Proceed";
        if (confirm(text) == true) {
            const result = await fetch(baseUrl + "products/" + product_id + "?forced=" + hard, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                }
            }).then(response => {
                setLoading(false)
                if (response.status >= 500) {
                    return window.alert("Failed to Delete Image. Code 500");
                }
                if (response.status === 401 || response.status === 403) { window.alert("Failed to Delete Product"); return navigate('/login') }
                if (response.status >= 400) {
                    throw Error(response)
                }
                let index = products.find(i => i.id == product_id)
                if (index != undefined) {
                    if (hard) {
                        products.splice(index, 1);
                    }
                    else {
                        index.deleted = true
                    }
                }
                setProducts(u => [...products])
                window.alert("Delete Successfully")
            }).catch((e) => { window.alert("Failed to Delete Products"); console.log(e) });
        } else {
            return setLoading(false)
        }
    }
    async function restoreProduct(e) {
        setLoading(true)
        const result = await fetch(baseUrl + "products/" + e.target.value, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(response => {
            setLoading(false)
            if (response.status >= 500) {
                return window.alert("Failed to Restore Product");
            }
            if (response.status === 401 || response.status === 403) { window.alert("Failed to Restore Product"); return navigate('/login') }
            if (response.status >= 400)
                throw Error(response.statusText)

            const index = products.find(i => i.id == e.target.value)
            if (index != undefined) {
                index.deleted = false;
            }
            setProducts(u => [...products])
            window.alert("Restore Product Successfully")
        }).catch((e) => { window.alert("Failed to Restore Product"); });
        return setLoading(false)
    }

    return (<>
        <Container>
            {loading ? (<h5 className="m-5"> Loading ... </h5>) : ""}
            <Container className="m-3">
                <Button as={Link} to={"/products/new"}>New Product</Button>
            </Container>
            <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                    <tr>
                        {tableHeader.map((header) => (
                            <th key={header} >{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products && products.map((product, index) => (
                        <tr key={index} className="align-middle">
                            <td key={product.id}> {product.id}</td>
                            <td> {product.name}</td>
                            <td > {product.description}</td>
                            <td> {product.amount}</td>
                            <td> {product.price}</td>
                            <td> {product.rating}</td>
                            <td> {JSON.stringify((product.category.map(c => { return (c.id); })))}</td>
                            <td> {product.feature ? "True" : "False"}</td>
                            <td> {product.created_at}</td>
                            <td> {product.updated_at}</td>
                            {/* <td> {product.image.map(i => { return (<><Link to={i.url}>{i.url}</Link> <br /></>); })}</td> */}
                            <td style={{ width: "100px" }}><Container className="justify-content-center d-flex flex-column">
                                <Button className="m-3 btn-warning" key={"edit_" + product.id} as={Link} to={"/products/" + product.id}>Edit</Button>
                                {
                                    product.deleted ?
                                        <Button className="m-3 btn-success" key={"restore" + product.id} value={product.id} onClick={(e) => restoreProduct(e)}>Restore</Button>
                                        :
                                        <Button className="m-3 btn-danger" key={"delete_" + product.id} value={product.id} onClick={(e) => deleteProduct(e, false)}>Soft Delete</Button>

                                }
                            </Container>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>

            <Row className='mt-4 justify-content-center'>
                <Pagination changePage={changePage} total={total}></Pagination>
            </Row>
        </Container>
        
    </>);
}

export default Products;