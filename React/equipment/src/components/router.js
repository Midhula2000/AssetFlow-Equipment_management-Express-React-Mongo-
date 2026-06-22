import { createBrowserRouter } from "react-router-dom";
import Adminlogin from "./Admin/Adminlogin";
import App from "../App";
import Dashboard from "./Admin/Dashboard";
import CreateEquipment from "./Admin/CreateEquipment";
import EditEquipment from "./Admin/EditEquipment";
import TransactionList from "./Admin/ViewAllTransactions";
import ActiveBorrowings from "./Admin/ActiveBorrowings";
import ReturnedItems from "./Admin/ReturnedItems";
import Userlogin from "./User/Userlogin";
import Userdashboard from "./User/Userdashboard";
import MyActiveBorrowings from "./User/MyActiveBorrowings";
import Home from "./Admin/Home";
import ActiveBorrowers from "./Admin/Activeborrower";
import AdminProtectedRoutes from "./Admin/AdminProtectedRoutes";
import UserProtectedRoute from "./User/UserProtectedRoute";

const router = createBrowserRouter([
 
    {path: '',element: <App/>},

    { path: 'home', element:( <AdminProtectedRoutes><Home/></AdminProtectedRoutes> )},
    { path: 'adminlogin', element: <Adminlogin/> },
    { path: 'admin-dashboard', element: (<AdminProtectedRoutes><Dashboard/></AdminProtectedRoutes> )},
    {path: 'admin/edit/:id', element: (<AdminProtectedRoutes><EditEquipment /></AdminProtectedRoutes>)},
    {path: 'admin/create', element:  (<AdminProtectedRoutes><CreateEquipment /></AdminProtectedRoutes>)},
    {path: 'admin/transactions', element: (<AdminProtectedRoutes><TransactionList /></AdminProtectedRoutes>)},
    {path: 'admin/active-borrowings', element:(<AdminProtectedRoutes> <ActiveBorrowings /></AdminProtectedRoutes>)},
    {path: 'admin/returned-items', element: (<AdminProtectedRoutes><ReturnedItems /></AdminProtectedRoutes>)},

{path: 'admin/active-borrowers', element: <ActiveBorrowers />},





 {path: 'user/login', element: <Userlogin />},
 {path: 'user-dashboard', element: (<UserProtectedRoute><Userdashboard /></UserProtectedRoute>)},
 {path: 'my-active-borrowings', element: (<UserProtectedRoute><MyActiveBorrowings /></UserProtectedRoute>)}


]);

export default router;