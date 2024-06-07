import { Image, Rate } from "antd";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Figure, Form, ListGroup, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined, } from '@ant-design/icons';

function ProductDetail(props) {

    const { productId } = useParams()

    let { loggedIn, baseUrl, token } = props;

    let [product, setProduct] = useState({});

    let [categories, setCategories] = useState([]);
    let [categoryId, setCategoryId] = useState('');
    let [newImage, setNewImage] = useState({});
    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let navigate = useNavigate();


    const getProduct = async () => {
        const response = await fetch(baseUrl + 'products/' + productId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            if (response.status === 401 || response.status === 403) { return navigate('/login') }
            if (response.status > 500) {
                { console.error(e.status); setError(true); }
            }
            let data = await response.json();
            setProduct(data);
        }).catch((e) => { console.error(e.status); setError(true); });
    };


    async function getCategories() {
        const result = await fetch(baseUrl + "categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            if (response.status === 401 || response.status === 403) { return navigate('/login') }
            if (response.status > 500) {
                { console.error(e.status); setError(true); }
            }
            let data = await response.json();
            setCategories(data);
        }).catch((e) => { console.error(e.status); setError(true); });

    }

    useEffect(() => {
        getProduct()
        getCategories()
        setLoading(false)
    }, []);

    function changeProductInfo(name, e) {
        setProduct(p => ({ ...p, [name]: e }));
        console.log(product)
    }

    function addCategory(value) {
        if (product.category.find(i => i.id == value) != undefined) {
            return
        }
        const c = categories.find(i => i.id == value);
        const category = [...product.category, c];
        setProduct(p => ({ ...p, category }))
    }

    function removeCategory(e) {
        console.log(e.target.value);
        const index = product.category.find(i => i.id == e.target.value)
        if (index != undefined) {
            product.category.splice(index, 1);
        }
        setProduct(p => ({ ...p, category: product.category }))
    }

    function updateCategory(e) {
        e.preventDefault();
        console.log(product.category);
    }

    async function editProduct(e) {
        e.preventDefault();
        setLoading(true);
        console.log(product);
        const result = await fetch(baseUrl + "products", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(product),
        }).then(async response => {
            if (response.status >= 500) {
                console.log(response);
                setLoading(false)
                return window.alert("Failed to Update Product");
            }
            if (response.status > 400) { window.alert("Failed to Update Product"); return navigate('/login') }
            const data = await response.json();
            console.log(data);
            setProduct(data);
            setLoading(false);
            return window.alert("Update Product Successfully");
        }).catch((e) => {
            console.log(e);
            setLoading(false)
            return window.alert("Failed to Update Product");
        })
    }
    async function addImage(e) {
        setLoading(true)
        e.preventDefault()
        let images = e.target[0].files;
        let product_id = product.id;
        if (images.length === 0 || images === undefined) {
            return window.alert("No Images Chosen");
        }
        Array.from(images).forEach(async image => {
            const formData = new FormData();
            formData.append('product_id', product_id);
            formData.append('file', image);
            formData.append('name', image.name);
            const result = await fetch(baseUrl + "products/images", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                }, body: formData
            }).then(async response => {
                if (response.status >= 500) {
                    setLoading(false)
                    return window.alert("Failed to Insert Image: " + response.statusText);
                }
                if (response.status > 400) { window.alert("Failed to Insert Image"); return navigate('/login') }
                let data = await response.json();
                console.log(data);
                product.image = [...product.image, data]
                setProduct(p => ({ ...p, image: product.image }))
                handleClose()
                window.alert("Insert Images Successfully")
                return setLoading(false)
            }).catch((e) => {
                console.log(e);
                setLoading(false)
                return window.alert("Failed to Insert Image");
            });
        });
    }
    async function restoreImage(e) {
        setLoading(true)
        let body = { image_id: [e.target.value] };
        const result = await fetch(baseUrl + "products/images/" + e.target.value, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
            // body: JSON.stringify(body),
        }).then(response => {
            setLoading(false)
            if (response.status >= 500) {
                return window.alert("Failed to Restore Image");
            }
            if (response.status === 401 || response.status === 403) { window.alert("Failed to Restore Image"); return navigate('/login') }
            if (response.status >= 400)
                throw Error(response.statusText)
            const index = product.image.find(i => i.id == e.target.value)
            if (index != undefined) {
                index.deleted = false;
            }
            setProduct(p => ({ ...p, image: product.image }))
            window.alert("Restore Image Successfully")
        }).catch((e) => { window.alert("Failed to Restore Image"); });
        return setLoading(false)
    }
    async function deleteImage(e, hard) {
        e.preventDefault();
        setLoading(true)
        let text = "Delete Image. Press Comfirm to Proceed";
        if (confirm(text) == true) {
            let body = { product_id: product.id, image_id: [e.target.value], hard: hard };
            const result = await fetch(baseUrl + "products/images", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(body),
            }).then(response => {
                setLoading(false)
                if (response.status >= 500) {
                    return window.alert("Failed to Delete Image. Code 500");
                }
                if (response.status === 401 || response.status === 403) { window.alert("Failed to Delete Image"); return navigate('/login') }
                if (response.status >= 400) {
                    throw Error(response.statusText)
                }
                let index = product.image.find(i => i.id == e.target.value)
                if (index != undefined) {
                    if (hard) {
                        product.image.splice(index, 1);
                    }
                    else {
                        index.deleted = true
                    }
                }
                setProduct(p => ({ ...p, image: product.image }))
                window.alert("Delete Successfully")
            }).catch((e) => { window.alert("Failed to Delete Image"); console.log(e) });
        } else {
            return setLoading(false)
        }
    }

    if (!loggedIn) return navigate('/login');

    return (
        <>
            <Container className="mt-5">
                <Form onSubmit={(e) => editProduct(e)}>
                    <Form.Group className="mb-3" id="name">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" defaultValue={product.name} autoFocus onChange={(e) => changeProductInfo("name", e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="price">
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control type="number" defaultValue={product.price} min={1} onChange={(e) => changeProductInfo("price", e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="amount">
                        <Form.Label>Product Amount</Form.Label>
                        <Form.Control type="number" defaultValue={product.amount} min={1} onChange={(e) => changeProductInfo("amount", e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="description">
                        <Form.Label>Product Description</Form.Label>
                        <Form.Control as="textarea" rows={3} defaultValue={product.description} maxLength={255} onChange={(e) => changeProductInfo("description", e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="feature">
                        <Form.Label>Product Feature</Form.Label>
                        <Form.Check type="switch" defaultChecked={product.feature} id="feature" onChange={(e) =>{console.log(e.target.checked); changeProductInfo("feature", e.target.checked)}} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="submit">
                        <Button type="submit">Edit
                        </Button>
                    </Form.Group>
                </Form>
            </Container>
            <hr></hr>
            <Container>
                <Form>
                    <Form.Group className="mb-3" id="category">
                        <Form.Label>Product Category</Form.Label>
                        <div key={"category_check"} className="mb-3">

                            {product.category && product.category.map(c => (
                                <Button
                                    variant="outline-dark"
                                    className="mx-1"
                                    inline="true"
                                    id={"category_" + c.id}
                                    value={c.id}
                                    onClick={(e) => { removeCategory(e) }}
                                >{c.name}</Button>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" id="add_category" onSubmit={(e) => { updateCategory(e) }}>
                        <Form.Label>Add Category</Form.Label>
                        <Form.Select aria-label="Category Selection" onChange={(e) => { addCategory(e.target.value) }}>
                            {categories && categories.map((category, index) => (
                                <option value={category.id}>{category.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" id="add_category">
                        <Button type="submit"> Update Catgegory</Button>
                    </Form.Group>
                </Form>
            </Container>
            <hr></hr>
            <Container className="mb-3" id="image">
                <h3>Product Images</h3>
                <br></br>
                <Button variant="success" className="mt-3" onClick={handleShow}> Add Image</Button>

                <Row className="my-3 g-2 align-items-center">
                    {product.image && product.image.map(i => (
                        <Card style={{ width: '18rem' }} className="m-1">
                            <Card.Img
                                width={'150px'}
                                src={i.url}
                                rounded
                            />
                            {i.id}
                            <Card.Body >
                                <Container fluid className=" d-flex justify-content-around">
                                    {i.deleted ?
                                        <>
                                            <Button size="sm" value={i.id} variant="outline-danger" onClick={(e) => deleteImage(e, true)} >Hard Delete</Button>
                                            <Button size="sm" value={i.id} variant="outline-success" onClick={(e) => restoreImage(e)} >Restore</Button>
                                        </>
                                        :
                                        <Button size="sm" value={i.id} variant="outline-warning" onClick={(e) => deleteImage(e, false)} >Soft Delete</Button>
                                    }
                                </Container>
                            </Card.Body>
                        </Card>
                    ))}
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Image</Modal.Title>
                </Modal.Header>
                <Form onSubmit={(e) => addImage(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3" id="exampleForm.ControlInput1">
                            <Form.Label>Choose Image</Form.Label>
                            <Form.Control type="file" multiple id="uploadImage" accept="image/png, image/gif, image/jpeg" onChange={(e) => { console.log(e.target.files); setNewImage(e.target.files) }} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-around">
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            {loading ? "Uploading": "Upload"}
                            {/* Upload */}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default ProductDetail;