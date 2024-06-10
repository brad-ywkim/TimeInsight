import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SideMenu from "../../component/SideMenu";
import AdminMember from "./AdminMember";
import AdminProduct from "./AdminProduct";
import AdminExpert from "./AdminExpert";
import "./admin.css";
import { useEffect } from "react";
const AdminMain = (props) => {
  const isLogin = props.isLogin; //로그인 여부 확인 후 안되어있으면 강퇴하기 위함함
  const navigate = useNavigate();

  if (!isLogin) {
    // Swal.fire("로그인 후 이용가능합니다.").then(() => {
    navigate("/");
    // });
  }

  const [menus, setMenus] = useState([
    { url: "adminMember", text: "회원관리", active: false }, //url:link경로, text:메뉴명, active:활성메뉴 디자인 변경
    { url: "adminProduct", text: "상품관리", active: false },
    { url: "adminExpert", text: "전문가관리", active: false },
  ]);

  return (
    <div className="mypage-wrap">
      <div className="mypage-content">
        <div className="mypage-side-menu">
          <span>서비스 관리</span>
          <SideMenu menuItems={menus} setMenuItems={setMenus} type="admin" />
        </div>
        <div className="mypage-current-content">
          <Routes>
            <Route path="/adminMember" element={<AdminMember />} />
            <Route path="/adminProduct" element={<AdminProduct />} />
            <Route path="/adminExpert" element={<AdminExpert />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
