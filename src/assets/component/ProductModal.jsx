import { useState , useRef , useEffect} from 'react'
import { Modal } from 'bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env;

function ProductModal({
  modalMode,
  tempProduct,
  isOpen,
  setIsOpen,
  getProducts,
  pageInfo
}) {
  // Modal相關
  const productModalRef = useRef(null);

  useEffect(() => {
    // 建立Modal實例
    new Modal(productModalRef.current , {
      backdrop : false,
      // 取消Modal背景&預設點擊外面關閉的功能
      keyboard : false
      // 取消Modal使用鍵盤操控
    });
    // 取得Modal實例
    // Modal.getInstance(productModalRef.current);
  },[])

  const [ modalData , setModalDate ] = useState(tempProduct)

  useEffect(() => {
    if (isOpen) {
      Modal.getInstance(productModalRef.current).show()
    }
  },[isOpen])

  useEffect(() => {
    setModalDate(tempProduct)
  },[tempProduct])

  const handleCloseProductModal = () => {
    Modal.getInstance(productModalRef.current).hide()
    setIsOpen(false)
  };

  // 監聽Modal input
  const handleModalInputChange = (e) => {
    const { name , value , type , checked } = e.target;
    setModalDate({
      ...modalData,
      [name] : type === "checkbox" ? checked : value
    });
  };

  // 新增產品
  const createProduct = async () => {
    try {
      await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/product`, {
        data : {
          ...modalData,
          origin_price : Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0 ,
          can_ice: modalData.can_ice ? 1 : 0 ,
          can_hot: modalData.can_hot ? 1 : 0 ,
        }
      });
      Swal.fire({
        title: "成功建立新的產品",
        icon: "success",
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
          ...modalData,
          origin_price : Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0 ,
          can_ice: modalData.can_ice ? 1 : 0 ,
          can_hot: modalData.can_hot ? 1 : 0 ,
        }
      });
      Swal.fire({
        title: "成功更新的產品",
        icon: "success",
      }).then(() => {
        getProducts(pageInfo.current_page)
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

  // 修改副圖
  const handleImgChange = (e,index) => {
    const { value } = e.target;

    const newImgsArr = [...modalData.imagesUrl];

    newImgsArr[index] = value;

    setModalDate({
      ...modalData,
      imagesUrl: newImgsArr
    });
  }

  const addImg = () => {
    const newImgsArr = [...modalData.imagesUrl, ""];
    // newImgsArr.push("");

    setModalDate({
      ...modalData,
      imagesUrl: newImgsArr
    });
  }

  const deleteImg = () =>  {
    const newImgsArr = [...modalData.imagesUrl];

    newImgsArr.pop();

    setModalDate({
      ...modalData,
      imagesUrl: newImgsArr
    });
  }
  // 修改副圖

  // 上傳圖片
  const handleUploadChange = async(e , imgType) => {
    const file = e.target.files[0]
    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/upload` , formData)
      const imageUrl = res.data.imageUrl

      switch (imgType) {
        case "main":
          setModalDate({
            ...modalData,
            imageUrl
          });
          break;

        case "minor":
          const newImgsArr = [...modalData.imagesUrl];
          newImgsArr.pop()
          newImgsArr.push(imageUrl)
          setModalDate({
            ...modalData,
            imagesUrl: newImgsArr
          });
          break;
      
        default:
          break;
      }
      e.target.value = null
      
    } catch (error) {
      console.log(error)
    }
  }
  // 上傳圖片

  return (
    <>
                                                                          {/* Modal backdrop被取消，因此補上背景顏色 */}
      <div id="productModal" className="modal" ref={productModalRef} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title fw-bolder">{modalMode === "create" ? "新增產品" : "編輯產品"}</h5>
              <button type="button" className="btn-close" onClick={handleCloseProductModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  {/* 主圖 */}
                  <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                    <input type="file" accept=".jpg,.jpeg,.png" className="form-control" id="fileInput" onChange={(e) => handleUploadChange (e , "main")}/>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">主圖</label>
                    <input name="imageUrl" id="primary-image" type="text" className="form-control mb-2" placeholder="請輸入圖片連結"
                      value={modalData.imageUrl} onChange={handleModalInputChange} />
                    <img src={modalData.imageUrl} alt={modalData.title} className="img-fluid" />
                  </div>
                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    <div className="mb-3">
                      <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                      <input type="file" accept=".jpg,.jpeg,.png" className="form-control" id="fileInput" onChange={(e) => handleUploadChange (e , "minor")}/>
                    </div>
                    {modalData.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label htmlFor={`imagesUrl-${index + 1}`} className="form-label" > 副圖 {index + 1} </label>
                        <input value={image} onChange={(e)=>handleImgChange(e,index)} id={`imagesUrl-${index + 1}`} type="text" placeholder={`圖片網址 ${index + 1}`} className="form-control mb-2" />
                        {image && (<img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-2" />)}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {modalData.imagesUrl.length < 5 && modalData.imagesUrl[modalData.imagesUrl.length - 1] !== "" && (
                        <button className="btn btn-outline-primary btn-sm w-100" onClick={addImg}>新增圖片</button>
                      )}
                      {modalData.imagesUrl.length > 1 && (
                        <button className="btn btn-outline-danger btn-sm w-100" onClick={deleteImg}>取消圖片</button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-8">

                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input name="title" id="title" type="text" className="form-control" placeholder="請輸入標題" 
                      value={modalData.title} onChange={handleModalInputChange} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">分類</label>
                    <input name="category" id="category" type="text" className="form-control" placeholder="請輸入分類"
                      value={modalData.category} onChange={handleModalInputChange} />
                  </div>

                  <div className="row g-3 mb-3 align-items-end">
                    <div className="col-4">
                      <label htmlFor="unit" className="form-label">單位</label>
                      <input name="unit" id="unit" type="text" className="form-control" placeholder="請輸入單位"
                        value={modalData.unit} onChange={handleModalInputChange} />
                    </div>
                    <div className="col-8">
                      <div className="border rounded p-3">
                        <div className="row">
                          <div className="col-6 ">
                            <div className="form-check">
                              <input name="can_ice" type="checkbox" className="form-check-input" id="can_ice"
                                checked={modalData.can_ice} onChange={handleModalInputChange} />
                              <label className="form-check-label" htmlFor="can_ice">是否冷飲</label>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-check">
                              <input name="can_hot" type="checkbox" className="form-check-input" id="can_hot"
                                checked={modalData.can_hot} onChange={handleModalInputChange} />
                              <label className="form-check-label" htmlFor="can_hot">是否熱飲</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">原價</label>
                      <input name="origin_price" id="origin_price" type="number" min={0} className="form-control" placeholder="請輸入原價"
                        value={modalData.origin_price} onChange={handleModalInputChange} />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">售價</label>
                      <input name="price" id="price" type="number" min={0} className="form-control" placeholder="請輸入售價"
                        value={modalData.price} onChange={handleModalInputChange} />
                    </div>
                  </div>
                
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">產品描述</label>
                    <textarea name="description" id="description" className="form-control" rows={4} placeholder="請輸入產品描述"
                      value={modalData.description}  onChange={handleModalInputChange} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">說明內容</label>
                    <textarea name="content" id="content" className="form-control" rows={4} placeholder="請輸入說明內容"
                      value={modalData.content}  onChange={handleModalInputChange} />
                  </div>

                  <div className="form-check">
                    <input name="is_enabled" type="checkbox" className="form-check-input" id="isEnabled"
                      checked={modalData.is_enabled} onChange={handleModalInputChange} />
                    <label className="form-check-label" htmlFor="isEnabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => handleUpdateProduct(modalData)}>儲存</button>
              <button type="button" className="btn btn-secondary" onClick={handleCloseProductModal}>取消</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default ProductModal;