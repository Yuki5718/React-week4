function Pagination({products,pageInfo,getProducts}) {

  const handlePageChange = (e , page) => {
    e.preventDefault()

    getProducts(page)
  }
  
  return (
    <>
    {products.length !== 0 && (
      <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination">
          {pageInfo.total_pages === 1 ? (<></>):(
            <li className="page-item">
              <a className={`page-link ${!pageInfo.has_pre && "disabled"}`} onClick={(e) => handlePageChange(e , pageInfo.current_page - 1)} href="#">
                上一頁
              </a>
            </li>
          )}

          {Array.from({ length: pageInfo.total_pages }).map(( _ , index ) => (
            <li key={index} className="page-item">
              <a className={`page-link ${pageInfo.current_page === index + 1 && "active"}`} onClick={(e) => handlePageChange(e , index + 1)} href="#">
                { index + 1 }
              </a>
            </li>)
          )}

          {pageInfo.total_pages === 1 ? (<></>): (
            <li className="page-item">
              <a className={`page-link ${!pageInfo.has_next && "disabled"}`} onClick={(e) => handlePageChange(e , pageInfo.current_page + 1)} href="#">
                下一頁
              </a>
            </li>
          )}
        </ul>
      </nav>
    </div>)}
  </>
  )
};

export default Pagination;