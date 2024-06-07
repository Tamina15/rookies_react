import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { message, Space } from 'antd';


function Cart(props) {
    const { baseUrl, token, loggedIn } = props;

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const [cartMap, setCartMap] = useState({ map: new Map() });

    const [products, setProducts] = useState([]);
    const [nullCart, setNullCart] = useState(localStorage.getItem("cart") === null);
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    useEffect(() => {
        parseCart();
        getCart();
    }, []);

    function parseCart() {
        let c = localStorage.getItem("cart");
        if (c === null) {
            return
        }
        let map = new Map();
        const array = c.split(',');
        array.forEach((id_amount) => {
            let single = id_amount.split(":");
            const id = Number(single[0]);
            const amount = Number(single[1]);
            // Check if the ID already exists in the map
            if (map.has(id)) {
                // If it exists, increase the amount
                let currentAmount = map.get(id);
                map.set(id, currentAmount + 1);
            } else {
                // If it doesn't exist, set the initial amount to 1
                map.set(id, amount);
            }
        });
        setCartMap(prevState => {
            const updatedMap = new Map(map);
            return { ...prevState, map: updatedMap };
        });
        let resultArray = Array.from(map, ([key, value]) => { return Number(key).toString() + ":" + value })
        let resultString = resultArray.join().trim();
        localStorage.setItem("cart", resultString);
    }

    async function getCart() {
        if (localStorage.getItem("cart") != null) {
            let cartParam = localStorage.getItem("cart").split(",").map(e => { return e.split(":")[0] }).join();
            const result = await fetch(baseUrl + "products/cart?product_id=" + cartParam, {
            }).then(async response => {
                const data = await response.json();
                if (response.status >= 500) { setError(true); window.alert("Error", JSON.parse(data).message) }
                if (response.status === 401 || response.status === 403) { window.alert("Forbidden"); navigate('/login') }
                if (response.status === 409) { setError(true); window.alert("409"); }
                if (response.status === 200) {
                    setProducts([...data]);
                }
            }).catch(e => { setLoading(false); setError(true); console.log(e); window.alert("Error: " + e); })
        }
        setLoading(false)
    }

    function changeCartAmount(id, index, up) {
        id = Number(id);
        let map = cartMap.map;
        let oldAmount = map.get(id);
        if (up) {
            if (oldAmount + 1 > products[index].amount) {
                message.info('Cannot Add More To Cart');
                map.set(id, products[index].amount);
            } else {

                map.set(id, oldAmount + 1);
            }
        }
        if (!up) {
            if (oldAmount <= 0) {
                map.set(id, 0);
            } else {

                map.set(id, oldAmount - 1);
            }
        }
        setCartMap(c => ({ ...c, map: map }));
        let resultArray = Array.from(map, ([key, value]) => { return Number(key).toString() + ":" + value })
        let resultString = resultArray.join().trim();
        localStorage.setItem("cart", resultString);
    }

    function removeFromCart(id, index) {
        id = Number(id);
        let text = "Remove From Cart ? Press Comfirm to Proceed";
        if (window.confirm(text) == true) {
            setLoading(true);
            let map = cartMap.map;
            map.delete(id);
            setCartMap(c => ({ ...c, map: map }));
            let resultArray = Array.from(map, ([key, value]) => { return Number(key).toString() + ":" + value })
            let resultString = resultArray.join().trim();
            localStorage.setItem("cart", resultString);
            products.splice(index, 1);
            setProducts(p => [...products]);
            if (products.length == 0) {
                localStorage.removeItem("cart");
                setNullCart(true);
            }
            setLoading(false);
        }

    }
    async function Buy(e) {
        setLoading(true);
        if (!loggedIn) {
            return navigate('/login');
        }
        const map = cartMap.map;
        let product_array = [];
        map.forEach((value, key) => { if (Number(value) > 0) product_array.push({ product_id: Number(key), amount: Number(value) }) })
        const body = {
            "products": product_array
        };
        console.log(body);

        // const result = await fetch(baseUrl + 'orders/', {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "Authorization": "Bearer " + token,
        //     },
        //     body: JSON.stringify(body)
        // }).then(async r => { console.log(await r.json()); setBuying(false) }).catch(e => { console.log(e); window.alert("Fail to register"); navigate('/error') })
    }



    if (nullCart) {
        return <>
            <Container className=" mt-5 d-flex justify-content-center">
                <h3> Your Cart Is Empty</h3>
                <Link to={'/products'}>Continue Buying</Link>
            </Container>
        </>
    }
    return (<>
        <Container fluid="xl" className='m-4 justify-content-center'>
            <Button variant="success" className="my-5" size="lg" onClick={e => { Buy() }}>Buy Now</Button>
            <Row xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} className="g-4">
                {products && products.map((product, index) => (

                    <Col key={product.id}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={product.image.length > 0 && product.image[0].url} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                    Total: { }
                                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * cartMap.map.get(product.id))}
                                </Card.Text>
                                <Row className="my-4">
                                    <Col>
                                        <Button variant="outline-info" size="lg" value={product.id} onClick={(e) => { changeCartAmount(e.target.value, index, false) }}>
                                            -
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="ouline-dark" size="lg" disabled>{cartMap.map.get(product.id)}</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="outline-info" size="lg" value={product.id} onClick={(e) => { changeCartAmount(e.target.value, index, true) }}>
                                            +
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="justify-content-center">
                                        <Button as={Link} to={'/products/' + product.id}>View Detail</Button>
                                    </Col>
                                    <Col className="justify-content-center">
                                        <Button variant="danger" value={product.id} onClick={(e) => { removeFromCart(e.target.value, index) }}>Remove</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    </>);
}

export default Cart;