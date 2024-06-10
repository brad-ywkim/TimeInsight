import axios from "axios";
import { Input } from "../../component/FormFrm";
import "./default.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = (props) => {
  const isLogin = props.isLogin;
  const logout = props.logout;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberGrade, setMemberGrade] = useState(null);

  // 관리자 여부 확인
  useEffect(() => {
    axios
      .get(backServer + "/member")
      .then((res) => {
        setMemberGrade(res.data.data.memberGrade);
      })
      .catch((res) => {
        console.log("에러", res);
      });
  }, [isLogin, memberGrade]);

  const navigate = useNavigate();
  const navigateMain = () => {
    navigate("/");
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <header>
      <div className="header">
        <div className="main-logo">
          <img src="/image/timeinsight.png" />
          <h1 onClick={navigateMain}>TimeInsight</h1>
        </div>
        <Navi />
        <div />
        <HeaderLink
          isLogin={isLogin}
          logout={logout}
          memberGrade={memberGrade}
        />
      </div>
    </header>
  );
};

const Navi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/product/all">TimeMarket</Link>
        </li>
        <li>
          <Link to="/realTimeBoard">Realtime BidLog </Link>
        </li>
        {/* <li>
          <Input text="검색" content="header-search" />
        </li> */}
      </ul>
    </nav>
  );
};

const HeaderLink = (props) => {
  const isLogin = props.isLogin;
  const logout = props.logout;
  const memberGrade = props.memberGrade;

  return (
    <div className="header-link">
      {isLogin ? (
        <>
          {/* 애초에 /member/info로 구체적으로 명시해줘서 회원정보 바로 뜨게 하기 */}
          <Link to="/member/info" title="마이페이지">
            <span className="material-icons">face</span>
          </Link>
          {memberGrade === 2 ? (
            <Link to="/admin/adminMember" title="관리자페이지">
              <span className="material-icons">manage_accounts</span>{" "}
            </Link>
          ) : (
            ""
          )}
          <Link to="#" title="로그아웃">
            <span className="material-icons" onClick={logout}>
              logout
            </span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" title="로그인">
            <span className="material-icons">login</span>
          </Link>
          <Link to="/join" title="회원가입">
            <span className="material-icons">account_circle</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
