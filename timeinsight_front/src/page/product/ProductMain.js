import { Route, Routes, useLocation, useParams } from "react-router-dom";
import SideMenu from "../../component/SideMenu";
import "./product.css";
import { useEffect, useState } from "react";
import ProductList from "./ProductList";

const ProductMain = (props) => {
  const location = useLocation();
  const { what } = useParams();
  // 카테고리 상태를 URL의 파라미터에 따라 초기화합니다.
  const [selectedCategory, setSelectedCategory] = useState(what || "all");

  const [menus, setMenus] = useState([
    { url: "all", text: "전체", active: false },
    { url: "economy", text: "경제", active: false },
    { url: "business", text: "비즈니스", active: false },
    { url: "it", text: "IT", active: false },
    { url: "sport", text: "스포츠", active: false },
    { url: "music", text: "음악", active: false },
    { url: "picture", text: "사진", active: false },
  ]);

  // URL의 파라미터가 변경될 때마다 카테고리 상태를 업데이트합니다.

  return (
    <div className="product-wrap">
      <div className="product-category">
        <span>카테고리</span>
        <SideMenu
          menuItems={menus}
          setMenuItems={setMenus}
          setSelectedCategory={setSelectedCategory}
          type="product"
        />
      </div>
      <div className="product-content">
        <Routes>
          <Route
            path="/:what"
            element={
              <ProductList
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default ProductMain;
