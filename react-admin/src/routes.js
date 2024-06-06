import Products from "./components/Products";
import Login from "./components/Login"
import Logout from "./components/Logout"
import ProductDetail from "./components/ProductDetail";
import Home from "./components/Home";
import Error from "./components/Error";
// import Profile from "./components/Profile";
import Users from "./components/Users"
import Categories from "./components/Categories";
import NewAdmin from "./components/NewAdmin";


export const appRoutes = [
    {
        path: "/",
        component: Home,
        requireAuth: true,
        // errorElement: Error
    },
    {
        path: "/products",
        component: Products,
        requireAuth: true
    },
    {
        path: "/categories",
        component: Categories,
        requireAuth: true
    },
    {
        path: "/products/:productId",
        component: ProductDetail,
        requireAuth: true
    },
    {
        path: "/users",
        component: Users,
        requireAuth: true,
    },
    {
        path: "/users/new",
        component: NewAdmin,
        requireAuth: true,
    },
    {
        path: "/login",
        component: Login,
        requireAuth: false,
    },
    {
        path: "/logout",
        component: Logout,
        requireAuth: false,
    },
    {
        path: "/*",
        component: Error,
        requireAuth: false,
    },


]