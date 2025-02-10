import { useState , useRef , useEffect} from 'react'
import { Modal } from 'bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import LoginPage from './assets/pages/LoginPage';
import ProductPage from './assets/pages/ProductsPage';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PAHT;

function App() {
  // 授權狀態，預設false
  const [isAuth, setIsAuth] = useState(false);

  return (
  <>{isAuth ? (
    // <></>
    <ProductPage />
  ) : ( <LoginPage setIsAuth={setIsAuth} />
    )}

  </>)
}

export default App
