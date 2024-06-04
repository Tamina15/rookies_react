import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { default as Pagination } from './Pagination'

const tableHeader = ['ID', 'Name', 'Description', "Action"]
function Categories(props) {

    const { baseUrl, feature, token, loggedIn } = props;
    if (!loggedIn) {
        return navigate('/login');
    }
    let [categories, setCategories] = useState([]);
    let [category, setCategory] = useState({});
    let [newCategory, setNewCategory] = useState({});

    let [total, setTotal] = useState(0);
    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        let index = categories.find(i => i.id == e)
        console.log(e, index);
        setCategory(index);
        setShow(true)
    };

    let navigate = useNavigate();

    const getCategories = async (url) => {
        const response = await fetch(url, {
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
            // setCategories(data.categories);
            // setTotal(data.count);
            setLoading(false)
        }).catch((e) => { console.error(e.status); setError(true); });
    };

    useEffect(() => {
        if (!loggedIn) navigate('/')
        else {
            getCategories(baseUrl + 'categories?sortBy=id');
        }
    }, []);

    // function changePage(page, pageSize) {
    //     console.log(page, pageSize);
    //     getCategories(baseUrl + "categories?" + "page=" + (page - 1) + "&" + "limit=" + (pageSize) + "&" + "sortBy=" + "id").catch((e) => { console.error(e); setError(true); });
    // }
    async function updateCategory(e) {
        setLoading(true)
        e.preventDefault();
        const result = await fetch(baseUrl + 'categories', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            }, body: JSON.stringify(category)
        }
        ).then(async response => {
            const data = await response.json();
            categories = categories.map(c => c.id !== data.id ? c : data);
            setCategories(c => [...categories])
        }).catch((e) => { console.error(e.status); setError(true); });
        setLoading(false)
    }

    function changeCategoryInfo(name, e) {
        setCategory(c => ({ ...c, [name]: e }));
    }

    function changeNewCategoryInfo(name, e) {
        setNewCategory(c => ({ ...c, [name]: e }));
    }
    async function createCategory(e) {
        e.preventDefault();
        if (Object.keys(newCategory).length === 0) {
            return window.alert("Please Provide Inputs")
        }
        setLoading(true)
        console.log(newCategory);
        const result = await fetch(baseUrl + 'categories', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            }, body: JSON.stringify(newCategory)
        }
        ).then(async response => {
            if (response.status >= 500) {
                return window.alert("Failed to Create New Category. Code 500");
            }
            if (response.status === 401 || response.status === 403) { window.alert("Failed to Create New Category"); return navigate('/login') }
            if (response.status >= 400) {
                throw Error(response.statusText)
            }
            const data = await response.json();
            console.log(data);
            setCategories(c => [...c, data])
            setNewCategory(c => { })
        }).catch((e) => { console.error(e.status); setError(true); });
        setLoading(false)
    }
    async function deleteCategory(e) {
        let text = "This action will PERMANENTLY Delete Category. Press Comfirm to Proceed";
        if (confirm(text) == true) {
            setLoading(true)
            const result = await fetch(baseUrl + "categories/" + e.target.value, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                }
            }
            ).then(async response => {
                if (response.status >= 500) {
                    return window.alert("Failed to Create New Category. Code 500");
                }
                if (response.status === 401 || response.status === 403) { window.alert("Failed to Create New Category"); return navigate('/login') }
                if (response.status >= 400) {
                    throw Error(response.statusText)
                }
                const data = await response.json();

                let cate = categories.filter(c => c.id != e.target.value);

                console.log("cate", cate, categories);
                setCategories(c => [...cate])
                window.alert("Delete Successfully")
            }).catch((e) => { console.error(e); setError(true); });
        }
        return setLoading(false)

    }
    return (<>
        {loading ? (<h5 className="m-5"> Loading ... </h5>) : ""}
        <Container className="m-5">
            <Form className="mb-4" onSubmit={(e) => { createCategory(e) }}>
                <Row className="gy-1 gx-3">
                    <Col sm={3} md={3}>
                        <Form.Control type="text" id="add_name" placeholder="Name" onChange={(e) => { changeNewCategoryInfo("name", e.target.value) }} />
                    </Col>
                    <Col>
                        <Form.Control type="text" id="add_description" placeholder="Description" onChange={(e) => { changeNewCategoryInfo("description", e.target.value) }} />
                    </Col>
                    <Col>
                        <Button type="submit">
                            Add Catgegory
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        {tableHeader.map((header) => (
                            <th key={header} >{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody key={"table_body"}>
                    {categories && categories.map((category, index) => (
                        <tr key={"table_row_" + index} style={{ height: "30px", "minHeight": "10px" }}>
                            <td key={category.id}> {category.id}</td>
                            <td> {category.name}</td>
                            <td > {category.description}</td>
                            <td style={{ width: "500px", "maxWidth": "500px" }}>
                                <Button className="m-3 btn-primary" key={"edit_" + category.id} value={category.id} onClick={(e) => handleShow(e.target.value)}>Edit</Button>
                                <Button className="m-3 btn-danger" key={"delete_" + category.id} value={category.id} onClick={(e) => deleteCategory(e)}>Delete</Button>
                                <Button className="m-3 btn-danger" key={"detail_" + category.id} value={category.id} onClick={(e) => deleteCategory(e)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>

        {/* <Row className='mt-4 justify-content-center'>
            <Pagination changePage={changePage} total={total}></Pagination>
        </Row> */}

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Cetegory</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => updateCategory(e)}>
                <Modal.Body>
                    <Form.Group className="mb-3" id="category_name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" id="name" onChange={(e) => { changeCategoryInfo("name", e.target.value) }} defaultValue={category.name} />
                    </Form.Group>
                    <Form.Group className="mb-3" id="category_decription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text-area" id="description" onChange={(e) => { changeCategoryInfo("description", e.target.value) }} defaultValue={category.description} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-around">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" type="submit">
                        {loading ? "Editing" : "Edit"}
                        {/* Upload */}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>);
}

export default Categories;