import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Login from './components/Login';
import SideBar from './components/SideBar';
import AddProduct from './components/AddProduct';
import Orders from './components/Orders';
import AllProducts from './components/AllProducts';
import DashBoard from './components/DashBoard';
import { ToastContainer} from 'react-toastify';


const App = () => {
    const [token, setToken] = useState(localStorage.getItem('adminToken')?localStorage.getItem('adminToken'): '');
    useEffect(() => {
        localStorage.setItem('adminToken', token);
    }, [token]);
    return (
        <div className=' min-h-screen'>
            <ToastContainer/>
            {token === ""
                ? <Login setToken={setToken}/>
                : <>
                    <NavBar setToken={setToken}/>
                    <hr/>
                    <div className='flex w-full'>
                        <SideBar/>
                        <div className='flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
                            <Routes>
                                <Route path='/' element={<DashBoard token={token}/>} />
                                <Route path='/AddProduct' element={<AddProduct token={token}/>} />
                                <Route path='/AllProducts' element={<AllProducts token={token}/>} />
                                <Route path='/Orders' element={<Orders token={token}/>} />
                            </Routes>
                        </div>
                    </div>
                </>}
        </div>
    )
}

export default App