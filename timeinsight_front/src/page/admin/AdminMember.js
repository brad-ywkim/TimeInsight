import { useNavigate } from "react-router-dom";
import { Button1, Button3 } from "../../component/FormFrm";
import Pagination from "../common/Pagination";
import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [selectedMemberNo, setSelectedMemberNo] = useState(null); // 선택된 전문가의 번호를 저장하는 상태

  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [memberList, setMemberList] = useState([]);

  const handleChange = (event, memberNo) => {
    const newGrade = event.target.value;
    console.log("등급: ", newGrade);
    axios
      .patch(backServer + "/admin/updateMemberGrade", {
        memberNo: memberNo,
        memberGrade: newGrade,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setMemberList((prevList) =>
            prevList.map((member) =>
              member.memberNo === memberNo
                ? { ...member, memberGrade: newGrade }
                : member
            )
          );
        } else {
          console.log("업데이트 실패:", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMemberSelection = (memberNo) => {
    setSelectedMemberNo((prevSelected) =>
      prevSelected === memberNo ? null : memberNo
    );
  };

  useEffect(() => {
    axios
      .get(backServer + "/admin/memberList/" + reqPage)
      .then((res) => {
        console.log(res);
        setMemberList(res.data.data.memberList);
        setPageInfo(res.data.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, backServer]);

  const bidHistory = (memberNo) => {
    if (memberNo === null) {
      Swal.fire({
        icon: "error",
        title: "회원을 선택해주세요.",
      });
    } else {
      setOpen(true);
      fetchPaymentInfo(memberNo); // 데이터를 불러오는 함수를 따로 정의하여 호출
    }
  };

  // 모달
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  };
  const thStyle = {
    backgroundColor: "#f2f2f2",
    padding: 10,
    border: "1px solid #ddd",
    color: "black",
  };

  const tdStyle = {
    padding: 10,
    border: "1px solid #ddd",
    textAlign: "center",
    color: "black",
  };
  const [open, setOpen] = useState(false);
  const [bidList, setBidList] = useState([]);
  const fetchPaymentInfo = (memberNo) => {
    axios
      .get(backServer + "/admin/memberBidHistory/" + memberNo)
      .then((res) => {
        console.log(res);
        setBidList(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const handleClose = () => setOpen(false);
  console.log("입찰내역:", bidList);
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">회원관리</div>
      <div className="expert-wrap">
        <div className="product-enroll-btn">
          <Button3
            text="입찰내역"
            clickEvent={() => bidHistory(selectedMemberNo)}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <h3 className="payment-title">입찰내역</h3>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>입찰번호</th>
                      <th style={thStyle}>상품명</th>
                      <th style={thStyle}>전문가</th>
                      <th style={thStyle}>입찰일</th>
                      <th style={thStyle}>입찰가</th>
                      <th style={thStyle}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidList.map((bid, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{bid.bidNo}</td>
                        <td style={tdStyle}>{bid.productName}</td>
                        <td style={tdStyle}>{bid.expertName}</td>
                        <td style={tdStyle}>{bid.bidDate}</td>
                        <td style={tdStyle}>
                          {bid.bidAmount.toLocaleString() + "원"}
                        </td>
                        <td style={tdStyle}>
                          {bid.bidState === 1
                            ? "입찰중"
                            : bid.bidState === 2
                            ? "납부대기(낙찰)"
                            : bid.bidState === 3
                            ? "패찰"
                            : bid.bidState === 4
                            ? "납부완료(낙찰)"
                            : "미납부(낙찰)"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Typography>
            </Box>
          </Modal>
        </div>
        <table className="expert-tbl">
          <thead>
            <tr>
              <th>회원번호</th>
              <th>이름</th>
              <th>아이디</th>
              <th>이메일</th>
              <th>회원등급</th>
              <th>가입일</th>
              <th>회원등급</th>
              <th>현황체크</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((m, index) => (
              <tr key={"m" + index}>
                <td>{m.memberNo}</td>
                <td>{m.memberName}</td>
                <td>{m.memberId}</td>
                <td>{m.memberEmail}</td>
                <td>
                  {m.memberGrade === 1
                    ? "일반"
                    : m.memberGrade === 2
                    ? "관리"
                    : "블랙"}
                </td>
                <td>{m.enrollDate}</td>
                <td>
                  <Select
                    id="demo-simple-select"
                    value={m.memberGrade}
                    onChange={(event) => handleChange(event, m.memberNo)}
                  >
                    <MenuItem value={1}>일반</MenuItem>
                    <MenuItem value={2}>관리</MenuItem>
                    <MenuItem value={3}>블랙</MenuItem>
                  </Select>
                </td>
                <td>
                  <Checkbox
                    checked={selectedMemberNo === m.memberNo}
                    onChange={() => handleMemberSelection(m.memberNo)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="product-page">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </div>
  );
};

export default AdminMember;
