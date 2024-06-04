import Products from "./components/Products";

function Home(props) {
    let feature = true;
    props = {...props, feature};
    return (<Products {...props}></Products>);
}
export default Home;