import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Container, Form, Modal, Nav, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import ProductDetail from './ProductDetail';
import { Link, Navigate } from 'react-router-dom';
import { StarTwoTone, } from '@ant-design/icons';
import { default as Pagination } from './Pagination';


const Products = (props) => {
    const { baseUrl, feature } = props;

    const [products, setProducts] = useState([]);
    let [categories, setCategories] = useState([]);
    let [categoryId, setCategoryId] = useState('');
    let [total, setTotal] = useState(0);
    let [error, setError] = useState(false);

    // addParam true to append to the query, false to start new param query
    const getProducts = async (url, addParam = true) => {
        if (addParam) {
            url = url + "?";
        } else {
            url = url + "&";
        }
        url = url + "category_id=" + categoryId + (feature ? '&featured=true' : '');

        const response = await fetch(url);
        let data = await response.json();
        console.log(data);
        setProducts(data.products);
        setTotal(data.count);
        return response.data;
    };
    async function getCategories(url) {
        const result = await fetch(url)
        if (result.status > 400) {
            setError(true);
            return [];
        }
        let data = await result.json();
        console.log(data);
        setCategories(data);
    }
    function applyCategory(e) {
        e.preventDefault();
        console.log(categoryId);
        let query = '';
        if (categoryId === 0) {
            categoryId = ''
        }
        getProducts(baseUrl + "products", true).catch((e) => { console.error(e); });
    }

    useEffect(() => {
        getProducts(baseUrl + 'products').catch((e) => { console.error(e); setError(true); });
        getCategories(baseUrl + "categories").catch((e) => { console.error(e); });
    }, []);

    if (error) {
        setError(false);
        return (<div>Error Getting Products</div>);
    }

    function changePage(page, pageSize) {
        console.log(page, pageSize);
        getProducts(baseUrl + "products?page=" + (page - 1) + "&" + (feature ? 'featured=true' : ''), false).catch((e) => { console.error(e); setError(true); });
    }

    return (
        <>
            <Container fluid='sm' className='mt-4 justify-content-center'>
                <Form onSubmit={(e) => { applyCategory(e); }}>
                    <Row>
                        <Col sm={2} md={2} xxl={2}>
                            <Form.Select aria-label="Category Selection" onChange={(e) => { setCategoryId(e.target.value) }}>
                                <option value=''>All</option>
                                {categories && categories.map((category, index) => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit">
                                Apply
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <Container fluid="xl" className='m-4 justify-content-center'>
                <Row xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} className="g-4">
                    {products && products.map((product, index) => (
                        <Col key={product.id}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={product.image.length > 0 && product.image[0].url} />
                                <Card.Body>
                                    <Card.Title>{product.name} {product.feature ? <StarTwoTone twoToneColor="#ffff00" /> : ""}</Card.Title>
                                    <Card.Text>
                                        {product.description}
                                    </Card.Text>
                                    <Row>
                                        <Col>
                                            <Button variant="primary">Add To Cart</Button>
                                        </Col>
                                        <Col>
                                            <Button variant="success" as={Link} to={'/products/' + product.id}>View Detail</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className='mt-4 justify-content-center'>
                    <Pagination changePage={changePage} total={total}></Pagination>
                </Row>
            </Container>
        </>
    );
};

export default Products;

