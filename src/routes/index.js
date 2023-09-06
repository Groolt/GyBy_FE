import AdminPage from "../pages/AdminPage/AdminPage"
import HomePage from "../pages/HomePage/HomePage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import OrderPage from "../pages/OrderPage/OrderPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductPage from "../pages/ProductPage/ProductPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage"
import PaymentPage from "../pages/PaymentPage/PaymentPage"
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess"
import MyOrder from "../pages/MyOrder/MyOrder"
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage"
export const routes = [
    {
        path: "/",
        element: HomePage,
        isShowHeader: true
    },
    {
        path: "/order",
        element: OrderPage,
        isShowHeader: true
    },
    {
        path: "/signin",
        element: SignInPage,
        isShowHeader: false
    },
    {
        path: "/signup",
        element: SignUpPage,
        isShowHeader: false
    },
    {
        path: "/productdetail/:id",
        element: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: '/details-order/:id',
        element: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: "/product/:type",
        element: TypeProductPage,
        isShowHeader: true
    },
    {
        path: "/product",
        element: ProductPage,
        isShowHeader: true
    },
    {
        path: "*",
        element: NotFoundPage,
        isShowHeader: false
    },
    {
        path: "/profile-user",
        element: ProfilePage,
        isShowHeader: true
    },
    {
        path: "/myorder",
        element: MyOrder,
        isShowHeader: true
    },
    {
        path: "/payment",
        element: PaymentPage,
        isShowHeader: true
    },
    {
        path: "/ordersuccess",
        element: OrderSuccess,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        element: AdminPage,
        isShowHeader: false,
        isPrivated: true
    },
]