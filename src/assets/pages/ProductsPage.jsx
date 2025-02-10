import { useState , useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import ProductModal from '../component/ProductModal';

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env;

// Modal狀態 預設值
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};

function ProductPage() {

  // 產品資料狀態
  const [products , setProducts] = useState([]);
  // 產品詳細狀態
  const [tempProduct , setTempProduct] = useState(defaultModalState);
  // 取得產品資料
  const getProducts = () => {
    axios.get(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/products`)
      .then((res) => {
        setProducts(res.data.products)
      })
      .catch((err) => console.error(err))
  }
  // 初始化取資料
  useEffect(() => {
    // 從cookie取token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    // 將token放入axios.headers
    axios.defaults.headers.common['Authorization'] = token;

    getProducts();
  },[])


  // 控制Modal
  const [ modalMode , setModalMode ] = useState(null);
  const [ isOpenModal , setIsOpenMoadl ] = useState(false)

  // Modal開關功能
  const handleOpenProductModal = ( mode , product ) => {
    // 寫入狀態
    setModalMode(mode);

    // 判斷編輯或新增
    switch (mode) {
      case "create":
        setTempProduct(defaultModalState)
        break;
      case "edit":
        setTempProduct(product);
        break;

      default:
        break;
    }

    setIsOpenMoadl(true)
  };

  // 新增產品
  const createProduct = async () => {
    try {
      await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/product`, {
        data : {
          ...tempProduct,
          origin_price : Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
      Swal.fire({
        title: "成功建立新的產品",
        icon: "success",
        draggable: true
      }).then(() => {
        getProducts()
        handleCloseProductModal();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "新增產品失敗",
        text: "請重新確認資料"
      });
    }
  }
  // 修改產品
  const editProduct = async (product) => {
    const id = product.id;
    try {
      await axios.put(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/product/${id}`, {
        data : {
          ...tempProduct,
          origin_price : Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
      Swal.fire({
        title: "成功更新的產品",
        icon: "success",
        draggable: true
      }).then(() => {
        getProducts()
        handleCloseProductModal();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "更新產品失敗",
        text: "請重新確認資料"
      });
      console.log(error)
    }
  }
  
  const handleUpdateProduct = async (product) => {
    switch (modalMode) {
      case "create":
        await createProduct();
        break;
      case "edit":
        await editProduct(product);
        break;

      default:
        break;
    }
  }

  // 刪除產品
  const deleteProduct = async (product) => {
    try {
      const id = product.id;
      await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/product/${id}`)
      Swal.fire({
        title: "成功刪除！",
        text: "產品已經刪除",
        icon: "success"
      }).then(() => getProducts());
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "產品刪除失敗",
        text: "請稍後再試"
      });
      console.log(error)
    }
  }
  
  const handleDeleteProduct = (product) => {
    Swal.fire({
      title: "確認要刪除？",
      text: "刪除後將無法復原",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確認",
      cancelButtonText: "取消"
    }).then((result) => {
      // isConfirmed為true，才會執行刪除功能
      if (result.isConfirmed) {
        deleteProduct(product);
      }
    });
  }

  return (
    <>
      <div className="container mt-5 mb-3">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2 className="fw-bolder">產品列表</h2>
              <button type="button" className="btn btn-primary fw-bolder" onClick={()=>handleOpenProductModal('create')}>建立新的產品</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">冷飲</th>
                  <th scope="col">熱飲</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="align-middle">
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className="fw-bolder">{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                    <td>{product.can_ice ? (<i className="bi bi-snow2 text-primary"></i>):(<></>)}</td>
                    <td>{product.can_hot ? (<i className="bi bi-fire text-danger"></i>):(<></>)}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-primary" onClick={()=>handleOpenProductModal('edit' , product)}>編輯</button>
                        <button type="button" className="btn btn-outline-danger" onClick={()=>handleDeleteProduct(product)}>刪除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductModal 
        modalMode = {modalMode}
        tempProduct = {tempProduct}
        handleUpdateProduct = {handleUpdateProduct}
        isOpen = {isOpenModal}
        setIsOpen = {setIsOpenMoadl}
      />
    </>
  )
};

export default ProductPage;