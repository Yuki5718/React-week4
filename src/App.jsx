import { useState } from 'react'
import LoginPage from './assets/pages/LoginPage';
import ProductPage from './assets/pages/ProductsPage';

function App() {
  // 授權狀態，預設false
  const [isAuth, setIsAuth] = useState(false);

  return ( <>{ isAuth ? ( <ProductPage /> ) : ( <LoginPage setIsAuth={setIsAuth} /> ) } </>)
  
}

export default App
