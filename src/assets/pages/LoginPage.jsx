import { useState , useEffect} from 'react'
import axios from 'axios'

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env;

function LoginPage({setIsAuth}) {

  // 登入表單狀態
  const [ account , setAccount ] = useState({
    "username": "example@test.com",
    "password": "example"
  });

  // 處理登入
  const handleInputAccount = (e) => {
    const { name , value } = e.target;
    
    setAccount({
      ...account,
      [name] : value,
    });
  };

  // 發送登入請求
  const submitLogin = async(e) => {
    e.preventDefault()
    try {
      // 發送登入請求
      const response = await axios.post(`${VITE_BASE_URL}/admin/signin`, account);

      // 解構取出 token,expired
      const { token , expired } = response.data;
      // 寫入cookie
      document.cookie = `hexToken=${token}; expired=${new Date(expired)}`;
      
      setIsAuth(true);
    }
    catch (error) {
      console.log(error)
    }
  };

  // 檢查授權功能
  const checkIsLogined = async() => {
    try {
      await axios.post(`${VITE_BASE_URL}/api/user/check`)
      setIsAuth(true)
    }
    catch (error) {
      console.error(error.response.data)
    }
  }

  // 初始化網頁，驗證是否授權
  useEffect(() => {
    // 從cookie取token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    // 將token放入axios.headers
    axios.defaults.headers.common['Authorization'] = token;

    checkIsLogined();
  },[])

  return (
    <>
      <div className="container">
        <div className="row vh-100 align-items-center justify-content-center">
          <div className="col-3 text-center">
            <h1 className="fw-bold mb-4">登入系統</h1>
            <form onSubmit={(e) => submitLogin(e)}>
              <div className="form-floating mb-3">
                <input name="username" type="email" className="form-control" id="username" placeholder="Email address" onChange={handleInputAccount} />
                <label htmlFor="username">請輸入Email</label>
              </div>
              <div className="form-floating mb-3">
                <input name="password" type="password" className="form-control" id="password" placeholder="Password" onChange={handleInputAccount} />
                <label htmlFor="password">請輸入密碼</label>
              </div>
              <button type="submit" className="btn btn-primary w-100">登入</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )

};

export default LoginPage;