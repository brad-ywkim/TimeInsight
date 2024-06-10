import { useEffect, useState } from "react";
import { Button1, Button2, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";

const MemberInfo = (props) => {
  const { member, setMember } = props;
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isAuth, setIsAuth] = useState(false); //현재비밀번호를 입력해서 인증여부
  const [currPw, setCurrPw] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const logout = props.logout;
  useEffect(() => {
    setPhone(member.memberPhone);
    setEmail(member.memberEmail);
  }, [member]);
  const updateMemberInfo = () => {
    console.log("수정", phone);
    const m = {
      memberId: member.memberId,
      memberPhone: phone,
      memberEmail: email,
    }; //주의: member.memberPhone이 아닌, set처리를 해준 phone을 넣어야 함
    axios
      .patch(backServer + "/member/updateInfo", m)
      .then((res) => {
        console.log("전화번호 수신: ", res.data);
        setMember({
          ...member,
          memberPhone: m.memberPhone,
          memberEmail: m.memberEmail,
        });
        if (res.data.message === "success") {
          Swal.fire({
            icon: "success",
            title: "전화번호 수정되었습니다.",
          });
        } else {
          Swal.fire({
            icon: "fail",
            title: "잠시 후 다시 시도해주세요.",
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const deleteMemberInfo = () => {
    Swal.fire({
      icon: "warning",
      title: "회원탈퇴",
      text: "회원탈퇴를 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        console.log("탈퇴하기");
        axios
          .delete(backServer + "/member") //id 보내줄 필요가 없음.
          .then((res) => {
            Swal.fire("탈퇴완료").then(() => {
              logout();
            });
          })
          .catch((res) => {
            console.log(res);
          });
      } else {
        console.log("취소");
      }
    });
  };
  const checkPw = () => {
    const member = { memberPw: currPw };
    axios
      .post(backServer + "/member/pw", member)
      .then((res) => {
        if (res.data.message === "valid") {
          setIsAuth(true);
          setCurrPw("");
        } else {
          Swal.fire({
            icon: "question",
            title: "비밀번호를 확인하세요",
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  const changePw = () => {
    if (memberPw !== "" && memberPwRe !== "" && memberPw === memberPwRe) {
      const m = { memberPw };
      axios
        .patch(backServer + "/member/pw", m)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({ icon: "success", title: "비밀번호 변경 완료" }).then(
              () => {
                setIsAuth(false);
                setMemberPw("");
                setMemberPwRe("");
              }
            );
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };
  return (
    <div className="mypage-info-wrap">
      <div className="mypage-current-title">회원정보</div>
      <table className="member-info-tbl">
        <tbody>
          <tr>
            <td>아이디</td>
            <td>{member.memberId}</td>
          </tr>
          {isAuth ? (
            <>
              <tr>
                <td>새 비밀번호</td>
                <td className="member-pw-wrap">
                  <Input
                    type="password"
                    content="memberPw"
                    data={memberPw}
                    setData={setMemberPw}
                  />
                </td>
              </tr>
              <tr>
                <td>비밀번호 확인</td>
                <td className="member-pw-wrap">
                  <Input
                    type="password"
                    content="memberPwRe"
                    data={memberPwRe}
                    setData={setMemberPwRe}
                  />
                  <Button1 text="입력" clickEvent={changePw} />
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td>비밀번호</td>
                <td className="member-pw-wrap">
                  <Input
                    type="password"
                    data={currPw}
                    setData={setCurrPw}
                    content="currPw"
                  />
                  <Button1 text="입력" clickEvent={checkPw} />
                </td>
              </tr>
            </>
          )}
          <tr>
            <td>이름</td>
            <td>{member.memberName}</td>
          </tr>
          <tr>
            <td>전화번호</td>
            <td id="member-phone">
              <div>
                <Input data={phone} setData={setPhone} type="text" id="phone" />
              </div>
            </td>
          </tr>
          <tr>
            <td>이메일</td>
            <td id="member-email">
              <div>
                <Input data={email} setData={setEmail} type="text" id="email" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="member-info-btn">
        <Button1 text="수정하기" clickEvent={updateMemberInfo} />
        <Button2 text="회원탈퇴" clickEvent={deleteMemberInfo} />
      </div>
    </div>
  );
};

export default MemberInfo;
