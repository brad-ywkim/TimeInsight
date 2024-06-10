import { useState } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import { Button1, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
const Login = (props) => {
  const loginFunction = props.login;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");

  // 로그인
  const login = () => {
    if (memberId !== "" && memberPw !== "") {
      //조회라서 get이 맞으나, 로그인은 개인정보이므로 post로 전송
      const obj = { memberId, memberPw };
      axios
        .post(backServer + "/member/login", obj)
        .then((res) => {
          if (res.data.message === "success") {
            console.log("로그인", res.data);
            loginFunction(res.data.data);
            navigate("/");
          } else if (res.data.message === "blackMember") {
            Swal.fire("현재 이용제한 대상자입니다.");
          } else {
            Swal.fire("아이디 또는 비밀번호를 확인하세요.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="login-wrap">
      <div className="page-title">로그인</div>
      <div className="login-input-wrap">
        <label htmlFor="memberId">아이디</label>
        <Input
          type="text"
          id="memberId"
          data={memberId}
          setData={setMemberId}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="login-input-wrap">
        <label htmlFor="memberPw">비밀번호</label>
        <Input
          type="password"
          id="memberPw"
          data={memberPw}
          setData={setMemberPw}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="login-search-box">
        <Link to="#">아이디 찾기</Link>
        <span className="material-icons">horizontal_rule</span>
        <Link to="#">비밀번호 찾기</Link>
        <span className="material-icons">horizontal_rule</span>
        <Link to="/join">회원가입</Link>
      </div>
      <div className="login-btn-box">
        <Button1 text="로그인" clickEvent={login} />
      </div>
    </div>
  );
};

export default Login;
