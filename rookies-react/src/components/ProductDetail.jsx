import { Rate, Image } from "antd";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Figure, Form, Modal, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined, } from '@ant-design/icons';

function ProductDetail(props) {
    const { productId } = useParams()

    let { loggedIn, baseUrl } = props;

    let [product, setProduct] = useState({});

    let [buying, setBuying] = useState(false);

    let [buyAmount, setBuyAmount] = useState(1);

    let [rating, setRating] = useState(10)

    let [showError, setShowError] = useState(false)

    let navigate = useNavigate();



    const getProduct = async () => {
        const response = await fetch(baseUrl + 'products/' + productId);
        let data = await response.json();
        setProduct(data);
        return response.data;
    };

    useEffect(() => {
        getProduct().catch((e) => { console.error(e); navigate('/error') });
    }, []);

    async function Buy(e) {
        e.preventDefault();
        setBuying(true);
        if (!loggedIn) {
            return navigate('/login');
        }

        const body = { products: [{ product_id: parseInt(productId), amount: buyAmount }] };
        console.log(body);
        let token = JSON.parse(sessionStorage.getItem('user')).token;

        const result = await fetch(baseUrl + 'orders/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(body)
        }).then(async r => { console.log(await r.json()); setBuying(false) }).catch(e => { console.log(e); window.alert("Fail to register"); navigate('/error') })
    }

    async function SubmitRating(e) {
        if (!loggedIn) {
            return navigate('/login');
        }
        let product_id = parseInt(productId)
        let body = JSON.stringify({ product_id, rating });
        let token = JSON.parse(sessionStorage.getItem('user')).token;
        await fetch(baseUrl + "rates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: body
        }).then(async (data) => {
            if (data.status === 401 || data.status === 403) {
                window.alert("You are not logged in")
                return navigate('/login');
            }
            const result = await data.json();
            if (data.status === 409) {
                return window.alert(result.message);
            }
            product.rating = result.message;
            document.getElementById('viewRate').innerHTML = product.rating + " / 10"
        }).catch((e) => { console.error(e); navigate('/error') });

    }

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col xs={1} xxl={1}>
                        {product.image &&
                            product.image.map((i, index) => {
                                if (index >= 4) return;
                                else {
                                    return (<Image className="my-1" key={i.url}
                                        width={'auto'}
                                        src={i.url}
                                    />)
                                }
                            })
                        }
                    </Col>
                    <Col xs={2} sm={3} md={3} className="d-flex justify-content-center">
                        <Figure className="justify-content-center">

                            <Image 
                                width={'auto'}
                                src={product.image && product.image.length > 0 && product.image[0].url}
                            />
                            <Figure.Caption>
                                <Container className="d-flex flex-column">
                                    <h3 className="text-center justify-content-center" id="viewRate">
                                        {product.rating} / 10
                                    </h3>
                                    <Container className="d-flex flex-row m-auto justify-content-around">
                                        <Rate defaultValue={5} allowHalf={true} count={5} onChange={(e) => { setRating(e * 2) }} className="mx-4" />
                                        <Button className="btn-small" onClick={(e) => { SubmitRating(e) }}> Rate</Button>
                                    </Container>
                                </Container>
                            </Figure.Caption>
                        </Figure>
                    </Col>
                    <Col>
                        <Card className="text-center">
                            <Card.Header>{product.name}</Card.Header>
                            <Card.Body>
                                <Card.Title>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</Card.Title>
                                <Card.Text>
                                    {product.description}
                                </Card.Text>
                                <Form className="row align-items-center" onSubmit={(e) => Buy(e)}>
                                    <Row className="justify-content-center">
                                        <Col className="col-2">
                                            <Form.Control type="number" max={product.amount} min="1" defaultValue={1} onChange={(e) => setBuyAmount(e.target.value)}></Form.Control>
                                        </Col>
                                        <Col className="col-auto">
                                            <Button variant="primary" type="submit" disabled={buying ? true : false}>{buying ? <LoadingOutlined /> : "Buy now"}</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                            <Card.Footer className="text-muted">{product.amount} in stock</Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProductDetail;