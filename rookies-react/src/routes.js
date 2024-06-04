import Products from "./components/Products";
import Login from "./components/Login"
import Logout from "./components/Logout"
import ProductDetail from "./components/ProductDetail";
import Home from "./Home";
import Error from "./components/Error";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Orders from "./components/Orders";
export const appRoutes = [
    {
        path: "/",
        component: Home,
        requireAuth: false
    },
    {
        path: "/products",
        component: Products,
        requireAuth: false
    }, 
    {
        path: "/products/:productId",
        component: ProductDetail,
        requireAuth: false
    },
    {
        path: "/orders",
        component: Orders,
        requireAuth: false
    }, 
    {
        path: "/profile",
        component: Profile,
        requiresAuth: true,
    },
    // {
    //     path: "/login",
    //     component: Login,
    //     requiresAuth: false,
    // },
    // {
    //     path: "/register",
    //     component: Register,
    //     requiresAuth: false,
    // },
    {
        path: "/logout",
        component: Logout,
        requiresAuth: false,
    },
    {
        path: "/*",
        component: Error,
        requiresAuth: false,
    },

]