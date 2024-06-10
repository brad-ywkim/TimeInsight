import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./page/common/Footer";
import Header from "./page/common/Header";
import Main from "./page/common/Main";
import Join from "./page/member/Join";
import Login from "./page/member/Login";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import MemberMain from "./page/member/MemberMain";
import AdminMain from "./page/admin/AdminMain";
import ProductMain from "./page/product/ProductMain";
import ProductWrite from "./page/product/ProductWrite";
import ExpertWrite from "./page/product/ExpertWrite";
import ExpertDetail from "./page/product/ExpertDetail";
import ExpertUpdate from "./page/product/ExpertUpdate";
import ProductDetail from "./page/product/ProductDetail";
import Bid from "./page/product/Bid";
import Postcode from "./page/member/Postcode";
import ProductUpdate from "./page/product/ProductUpdate";
import RealTimeBoard from "./page/product/RealTimeBoard";

function App() {
  //스토리지에 저장된 데이터를 꺼내서 객체형식으로 변환
  const obj = JSON.parse(window.localStorage.getItem("member")); //객체로 들어있어서, 문자로 변환하였고 다시 객체변환 필요
  const [isLogin, setIsLogin] = useState(obj ? true : false); //로그인 상태를 체크하는 state
  //로그인 함수를 만들어서 전달함
  const [token, setToken] = useState(obj ? obj.accessToken : ""); //토큰값

  const [expiredTime, setExpiredTime] = useState(
    obj ? new Date(obj.tokenExpired) : ""
  ); //만료시간
  if (obj) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  //-------------------------------------------------------- 로그인
  const login = (accessToken) => {
    setToken(accessToken); //로그인 성공 시 받은 토큰 값 세팅
    const tokenExpired = new Date(new Date().getTime() + 60 * 60 * 1000); //만료시간: 현재시간+1시간 date 객체 생성

    setExpiredTime(tokenExpired);
    //토큰이랑, 만료시간을 객체로 묶은 후, 문자열을 반환해서 LocalStorage에 저장
    const obj = { accessToken, tokenExpired: tokenExpired.toISOString() }; //데이트 타입을 문자열로 변환
    //localstorage에는 문자열만 저장이 가능하므로 묶은 객체도 문자열로 변환
    const member = JSON.stringify(obj);
    window.localStorage.setItem("member", member);
    //axios 헤더에 토큰값 자동 설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

    setIsLogin(true);
    const remainingTime = tokenExpired.getTime() - new Date().getTime();
    console.log(remainingTime);
    setTimeout(logout, remainingTime);
  };
  //-------------------------------------------------------- 로그아웃
  const logout = () => {
    //로그인할 때 변경한 사항을 모두 원래대로 복원
    setToken(""); //토큰값
    setExpiredTime(""); //만료시간
    window.localStorage.removeItem("member"); //로컬스토리지 삭제
    axios.defaults.headers.common["Authorization"] = null; //axios 헤더 삭제
    setIsLogin(false); //로그인 false;
  };

  //페이지가 로드되면, 새로고침 되면
  useEffect(() => {
    if (isLogin) {
      //로그인이 되어 있으면
      //저장해둔 만료시간을 꺼내서 현재시간과 비교한 후 종료함수 설정
      const remainingTime = expiredTime.getTime() - new Date().getTime();
      setTimeout(logout, remainingTime);
    }
  }, []);
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div className="wrap">
      <Header isLogin={isLogin} logout={logout} />

      {isMainPage ? (
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      ) : (
        <main className="content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route
              path="/member/*"
              element={<MemberMain isLogin={isLogin} logout={logout} />}
            />
            <Route path="/product/*" element={<ProductMain />} />
            <Route path="/admin/*" element={<AdminMain isLogin={isLogin} />} />
            <Route
              path="/productWrite"
              element={<ProductWrite isLogin={isLogin} />}
            />
            <Route
              path="/expertWrite"
              element={<ExpertWrite isLogin={isLogin} />}
            />
            <Route
              path="/expertDetail/:expertNo"
              element={<ExpertDetail isLogin={isLogin} />}
            />
            <Route
              path="/expertUpdate/:expertNo"
              element={<ExpertUpdate isLogin={isLogin} />}
            />
            <Route
              path="/productDetail/:productNo"
              element={<ProductDetail isLogin={isLogin} />}
            />
            <Route
              path="/productUpdate/:productNo"
              element={<ProductUpdate isLogin={isLogin} />}
            />
            <Route path="/bid/:productNo" element={<Bid isLogin={isLogin} />} />
            <Route path="/address" element={<Postcode />} />
            <Route
              path="/realTimeBoard"
              element={<RealTimeBoard isLogin={isLogin} />}
            />
          </Routes>
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
