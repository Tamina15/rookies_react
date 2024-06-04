import { default as Navbar } from './Navbar'
import Products from './Products';


function Home(props) {
    return (
        <>
        <Products {...props}></Products>
        </>
    );
}

export default Home;