import { Button1, Button3, Button5, Input } from "../../component/FormFrm";
import "./member.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { add } from "date-fns";

const Join = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const navigate = useNavigate();
  //전송용 데이터
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [emailInActive, setEmailInActive] = useState(false); //이메일 활성 여부

  //화면 구현에 필요한 데이터
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [emailAuthCode, setEmailAuthCode] = useState(""); //사용자에게 입력받은 인증코도
  const [currentAuthCode, setCurrentAuthCode] = useState(""); //Java 랜덤 인증코드
  const [emailButtonColor, setEmailButtonColor] = useState("var(--main_01)"); //버튼색깔
  const [checkRegPhone, setCheckRegPhone] = useState(""); //전화번호
  const [chkAgree, setChkAgree] = useState(false); //약관동의 체크박스
  const [checkRegPw, setCheckRegPw] = useState(""); //비밀번호 정규식 메세지

  const chkAgreeChange = (e) => {
    setChkAgree(e.target.checked); // 약관 동의 상태를 토글합니다.
  };

  //----------------- 아이디 중복체크
  //아이디 입력하고 나갔을 때 이벤트(유효성 검사 and 중복체크)
  const idChk = () => {
    //정규표현식으로 유효성 검사
    const idReg = /^[a-zA-Z0-9]{4,12}$/;
    if (idReg.test(memberId)) {
      //정규표현식 만족
      setCheckIdMsg("");
      axios
        .get(backServer + "/member/id/" + memberId)
        .then((res) => {
          console.log("체크", res);

          if (res.data.message === "duplication") {
            setCheckIdMsg("이미 사용중인 아이디입니다.");
          } else {
            setCheckIdMsg("");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      //정규표현식 붊만족
      setCheckIdMsg("아이디는 영어 대/소문자/숫자로 4-12글자로 입력해주세요.");
    }
  };

  /*비밀번호 정규식        나중에*/
  const pwChk = () => {
    const regPw =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,16}$/;
    if (regPw.test(memberPw)) {
      setCheckRegPw("");
    } else {
      setCheckRegPw("영문, 숫자, 특수문자 조합 4~16자");
    }
  };

  //----------------- 비밀번호 유효성 검사
  //비밀번호 확인을 입력하면, 비밀번호화 일치하는지 체크하는 함수

  const pwCheck = () => {
    if (memberPw !== memberPwRe) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwMsg("");
    }
  };

  //---------------- 회원가입 버튼 클릭 시 동작할 이벤트

  const join = () => {
    if (
      memberId !== "" &&
      memberPw !== "" &&
      memberName !== "" &&
      memberPhone !== "" &&
      memberEmail !== "" &&
      checkIdMsg === "" &&
      checkPwMsg === "" &&
      emailAuthCode !== "" &&
      zipcode !== "" &&
      address !== "" &&
      addressDetail !== "" &&
      checkRegPhone === "" &&
      checkRegPw === "" &&
      chkAgree
    ) {
      const obj = {
        memberId,
        memberPw,
        memberName,
        memberPhone,
        memberEmail,
        zipcode,
        address,
        addressDetail,
      };
      console.log("보낸 데이터", obj);
      axios
        .post(backServer + "/member/join", obj)
        .then((res) => {
          if (res.data.message === "success") {
            //페이지 이동 = navigate (javascript 레벨에서 사용하는 페이지 이동 = a태그와 동일)
            navigate("/");
          } else {
            Swal.fire({
              icon: "error",
              title: "에러 발생",
              text: "처리 중 에러가 발생했습니다.",
            }).then(() => {
              navigate("/");
            });
            return;
          }
        })
        .then((res) => {
          console.log(res);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "회원가입 실패",
        text: "모든 항목을 입력해주세요.",
      });
      return;
    }
  };

  // 다음 주소 API
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data) => {
    let zonecode = data.zonecode;
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(zonecode);
    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

    setZipcode(zonecode);
    setAddress(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  // 이메일
  const sendEmail = (memberEmail) => {
    const obj = { memberEmail };
    axios
      .post(backServer + "/member/emailAuth", obj)
      .then((res) => {
        console.log("전송성공: ", res);
        const authCode = res.data.data;
        Swal.fire({ icon: "info", title: "인증코드 메일을 확인해주세요." });
        console.log(authCode);
        setCurrentAuthCode(authCode);
      })
      .catch((res) => {
        console.log("전송실패: ", res);
      });
  };

  const checkAuthCode = () => {
    if (emailAuthCode === currentAuthCode) {
      Swal.fire("이메일이 정상 인증되었습니다.").then(() => {
        setEmailInActive(true); //이메일 란 disalbed
        setEmailButtonColor("black");
      });
    } else {
      Swal.fire("인증번호가 일치하지 않습니다.");
    }
  };

  /*전화번호 정규식 및 하이픈 자동 입력*/
  const phoneChk = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외의 문자 제거
    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 7) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
    }
    if (value.length <= 13) {
      setMemberPhone(value);
    }

    const regPhone = /^\d{3}-\d{4}-\d{4}$/; //\d =>는 [0-9]와 동일한 의미 -> \d{3} 3자리 숫자)
    if (regPhone.test(value)) {
      setCheckRegPhone("");
    } else {
      setCheckRegPhone("숫자, 하이픈('-') 포함 13자 입력, 예)010-0000-0000");
    }
  };

  return (
    <div className="join-wrap">
      <div className="page-title">회원정보 입력</div>
      <JoinInputWrap
        label="아이디"
        id="memberId"
        type="text"
        data={memberId}
        setData={setMemberId}
        checkMsg={checkIdMsg}
        blurEvent={idChk}
      />

      <JoinInputWrap
        label="비밀번호"
        id="memberPw"
        type="password"
        data={memberPw}
        setData={setMemberPw}
        blurEvent={pwChk} //나중에
        checkMsg={checkRegPw}
      />
      <JoinInputWrap
        label="비밀번호 확인"
        id="memberPwRe"
        type="password"
        data={memberPwRe}
        setData={setMemberPwRe}
        checkMsg={checkPwMsg}
        blurEvent={pwCheck}
      />
      <JoinInputWrap
        label="이름"
        id="memberName"
        type="text"
        data={memberName}
        setData={setMemberName}
      />
      <div className="join-input-button-wrap" id="join-email-wrap">
        <JoinInputWrap
          label="이메일"
          id="memberEmail"
          type="text"
          data={memberEmail}
          setData={setMemberEmail}
          disabled={emailInActive}
        />
        <div className="input">
          <Button5
            type="button"
            text="인증코드 전송"
            id="email-verify"
            disabled={emailInActive}
            clickEvent={() => sendEmail(memberEmail)}
            style={{ backgroundColor: emailButtonColor }}
          />
        </div>
      </div>

      <div className="join-input-button-wrap">
        <JoinInputWrap
          label="인증코드"
          id="emailAuthCode"
          type="text"
          data={emailAuthCode}
          setData={setEmailAuthCode}
          disabled={emailInActive}
        />
        <div className="input">
          <Button5
            type="button"
            text="인증코드 확인"
            id="email-verify"
            disabled={emailInActive}
            clickEvent={checkAuthCode}
            style={{ backgroundColor: emailButtonColor }}
          />
        </div>
      </div>

      <div className="join-input-button-wrap" id="join-address-wrap">
        <JoinInputWrap
          label="주소"
          id="zipcode"
          type="text"
          data={zipcode}
          setData={setZipcode}
          disabled={true}
          inputWrapId="addressWrap"
        />
        <div className="input">
          <Button1
            type="button"
            text="주소검색"
            id="post-find"
            clickEvent={handleClick}
          />
        </div>
      </div>
      <JoinInputWrap
        id="address"
        type="text"
        data={address}
        setData={setAddress}
        disabled={true}
      />
      <JoinInputWrap
        id="addressDetail"
        type="text"
        data={addressDetail}
        setData={setAddressDetail}
      />
      <JoinInputWrap
        label="전화번호"
        id="memberPhone"
        type="text"
        data={memberPhone}
        setData={setMemberPhone}
        blurEvent={phoneChk}
        changeEvent={phoneChk}
        checkMsg={checkRegPhone}
      />

      <label>
        <input type="checkbox" onChange={chkAgreeChange} />
        [필수] 개인정보처리방침 및 이용약관에 동의합니다.
      </label>

      <div className="join-btn-box">
        <Button1 type="submit" text="가입하기" clickEvent={join}></Button1>
      </div>
    </div>
  );
};

const JoinInputWrap = (props) => {
  const label = props.label;
  const id = props.id;
  const type = props.type;
  const data = props.data;
  const setData = props.setData;
  const checkMsg = props.checkMsg;
  const blurEvent = props.blurEvent;
  const disabled = props.disabled;
  const changeEvent = props.changeEvent;
  const inputWrapId = props.inputWrapId;
  return (
    <div className="join-input-wrap" id={inputWrapId}>
      <div>
        <div className="label">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className="input">
          <Input
            data={data}
            setData={setData}
            type={type}
            id={id}
            changeEvent={changeEvent}
            blurEvent={blurEvent}
            disabled={disabled}
          />
        </div>
      </div>
      {checkMsg ? <div className="check-msg">{checkMsg}</div> : ""}
    </div>
  );
};

export default Join;
