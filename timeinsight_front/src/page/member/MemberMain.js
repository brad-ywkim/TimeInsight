import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SideMenu from "../../component/SideMenu";
import MemberInfo from "./MemberInfo";
import MemberBid from "./MemberBid";

const MemberMain = (props) => {
  const logout = props.logout;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  if (!isLogin) {
    // Swal.fire("로그인 후 이용가능합니다.").then(() => {
    navigate("/"); //main 페이지 접근 시 로그인이 안되어있으면 메인으로 돌려보냄
    // });
  }
  const [member, setMember] = useState({});

  useEffect(() => {
    axios
      .get(backServer + "/member")
      .then((res) => {
        console.log("데이터", res);
        setMember(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const [menuItems, setMenuItems] = useState([
    { url: "info", text: "회원정보", active: false }, //url:link경로, text:메뉴명, active:활성메뉴 디자인 변경
    { url: "bid", text: "입찰내역", active: false },
  ]);

  return (
    <div className="mypage-wrap">
      <div className="mypage-content">
        <div className="mypage-side-menu">
          <span>마이페이지</span>
          <SideMenu
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            type="member"
          />
        </div>
        <div className="mypage-current-content">
          <Routes>
            <Route
              path="/info"
              element={
                <MemberInfo
                  member={member}
                  setMember={setMember}
                  logout={logout}
                />
              }
            />
            <Route path="/bid" element={<MemberBid />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MemberMain;
