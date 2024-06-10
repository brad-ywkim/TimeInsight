import { useEffect } from "react";
import { useState } from "react";
import ProgressTap from "./ProgressTap";
import dayjs from "dayjs";
import axios from "axios";
import { Button1, Button3 } from "../../component/FormFrm";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Pagination from "../common/Pagination";

const MemberBid = () => {
  const [startDate, setStartDate] = useState(dayjs().subtract(2, "month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [activeButton, setActiveButton] = useState("twoMonth");
  const [currentTab, setCurrentTab] = useState(0);
  const [tabMenu, setTabMenu] = useState(["입찰진행중", "결제대기", "종료"]);
  const [currentStatus, setCurrentStatus] = useState(0);
  const navigate = useNavigate();

  //환경세팅
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //전송용 데이터
  const filterStartDate = startDate.format("YYYY-MM-DD");
  const filterEndDate = endDate.format("YYYY-MM-DD");
  const [reqPage, setReqPage] = useState(1);

  console.log("검색시작일 ", filterStartDate);
  console.log("검색종료일", filterEndDate);
  console.log("페이지번호", reqPage);
  console.log("현재 탭 값", currentStatus);

  //수신 데이터 -> set
  const [myBidList, setMyBidList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [cancellationStatus, setCancellationStatus] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});

  //거래데이터 추가

  useEffect(() => {
    setReqPage(1);
  }, [currentStatus]);

  const bidDetail = (productNo) => {
    navigate("/productDetail/" + productNo);
  };

  useEffect(() => {
    axios
      .get(
        backServer +
          "/member/bidHistory/" +
          currentStatus +
          "/" +
          reqPage +
          "/" +
          filterStartDate +
          "/" +
          filterEndDate
      )
      .then((res) => {
        console.log(res.data);
        setMyBidList(res.data.data.myBidList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [reqPage, currentStatus, startDate, endDate]);

  const payBidAmount = (
    bidNo,
    productNo,
    productName,
    bidAmount,
    memberEmail,
    memberName,
    memberPhone,
    address,
    addressDetail,
    zipcode,
    memberNo
  ) => {
    const { IMP } = window;
    IMP.init("imp52154560");
    const date = new Date();
    const dateString =
      date.getFullYear() +
      "" +
      (date.getMonth() + 1) +
      "" +
      date.getDate() +
      "" +
      date.getHours() +
      "" +
      date.getMinutes() +
      "" +
      date.getSeconds() +
      "" +
      date.getMilliseconds();
    console.log(memberPhone);
    const paymentNumber = productNo + dateString + memberNo;
    const obj = {
      merchant_uid: paymentNumber, //거래정보 = 상품번호(prodcutNo) + dateString(202451314172440)
      name: productName, //상품정보 = productName
      amount: bidAmount,
      buyer_email: memberEmail,
      buyer_name: memberName,
      buyer_tel: memberPhone,
      buyer_addr: address + " " + addressDetail,
      buyer_postcode: zipcode,
    };

    const payment = {
      bidNo: bidNo,
      memberNo: memberNo,
      tradeNo: parseInt(paymentNumber),
      productName: productName,
      paymentAmount: bidAmount,
    };

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: obj.merchant_uid,
        name: obj.name,
        amount: obj.amount,
        buyer_email: obj.buyer_email,
        buyer_name: obj.buyer_name,
        buyer_tel: obj.buyer_tel,
        buyer_addr: obj.buyer_addr,
        buyer_postcode: obj.buyer_postcode,
      },
      function (rsp) {
        if (rsp.success) {
          axios
            .post(backServer + "/bid/payment", payment)
            .then((res) => {
              axios
                .patch(backServer + "/bid/bidSuccess", { bidNo: bidNo })
                .then((res) => {
                  Swal.fire({
                    title: "결제성공",
                    icon: "success",
                  })
                    .then(() => {
                      setCurrentTab(2); // "결제완료" 탭으로 이동
                      setCurrentStatus(2); // 상태도 변경하여 UI 갱신
                    })
                    .catch((res) => {
                      console.log(res);
                    });
                });
            })
            .catch((res) => {
              console.log(res);
            });
        } else {
          console.log(rsp);
        }
      }
    );
    return "결제";
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = (bidNo, productName, bidAmount, memberName) => {
    setOpen(true);
    fetchPaymentInfo(bidNo); // 데이터를 불러오는 함수를 따로 정의하여 호출
  };

  const fetchPaymentInfo = (bidNo) => {
    axios
      .get(backServer + "/bid/" + bidNo)
      .then((res) => {
        console.log(res.data.data);
        setPaymentInfo(res.data.data); // 데이터 설정
      })
      .catch((error) => {
        console.error("데이터 로딩 중 오류 발생", error);
        setPaymentInfo({}); // 에러 발생 시 데이터 초기화
      });
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="mypage-current-wrap">
      <h3 className="mypage-bid-history-title">입찰내역</h3>
      <div className="mypage-bid-history-content-wrap">
        <ProgressTap
          tabMenu={tabMenu}
          setTabMenu={setTabMenu}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setReqPage={setReqPage}
          setCurrentStatus={setCurrentStatus}
        />
        <table className="mypage-bid-tbl">
          <thead>
            <tr>
              {currentStatus === 0 ? (
                <>
                  <th colSpan={2} width={"40%"}>
                    상품명
                  </th>
                  <th width={"10%"}>이름</th>
                  <th width={"15%"}>입찰일</th>
                  <th width={"15%"}>입찰가</th>
                  <th>입찰조정</th>
                </>
              ) : currentStatus === 1 ? (
                <>
                  <th colSpan={2} width={"40%"}>
                    상품명
                  </th>
                  <th width={"10%"}>이름</th>
                  <th width={"15%"}>낙찰가</th>
                  <th width={"15%"}>납부기한</th>
                  <th>잔금납부</th>
                </>
              ) : (
                <>
                  <th colSpan={2} width={"40%"}>
                    상품명
                  </th>
                  <th width={"10%"}>이름</th>
                  <th width={"15%"}>입찰마감일</th>
                  <th width={"15%"}>낙찰금액</th>
                  <th>입찰결과</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {myBidList.map((bid, index) => (
              <tr key={"bid" + index}>
                <td>
                  <img
                    src={
                      bid.expertThumbnail === null
                        ? "/image/default2.png"
                        : backServer + "/product/expert/" + bid.expertThumbnail
                    }
                    alt="썸네일"
                    width={"75px"}
                  />
                </td>
                <td>{bid.productName}</td>
                <td>{bid.expertName}</td>

                {currentStatus === 0 ? (
                  <>
                    <td>{bid.bidDate}</td>
                    <td>{bid.bidAmount.toLocaleString()}원</td>
                    <td>
                      <div>
                        <Button1
                          text="상세보기"
                          clickEvent={() => {
                            bidDetail(bid.productNo);
                          }}
                        />
                      </div>
                    </td>
                  </>
                ) : currentStatus === 1 ? (
                  <>
                    <td>{bid.bidAmount.toLocaleString()}원</td>
                    <td>{bid.paymentDueDate}</td>
                    <td>
                      <div>
                        <Button1
                          text="납부하기"
                          clickEvent={() => {
                            payBidAmount(
                              bid.bidNo,
                              bid.productNo,
                              bid.productName,
                              bid.bidAmount,
                              bid.memberEmail,
                              bid.memberName,
                              bid.memberPhone,
                              bid.address,
                              bid.addressDetail,
                              bid.zipcode,
                              bid.memberNo
                            );
                          }}
                        />
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{bid.endDate}</td>
                    <td>{bid.bidAmount.toLocaleString()}원</td>
                    <td>
                      <div>
                        {bid.bidState === "3" ? (
                          "패찰"
                        ) : bid.bidState === "4" ? (
                          <>
                            <Button
                              onClick={() =>
                                handleOpen(
                                  bid.bidNo,
                                  bid.productName,
                                  bid.bidAmount,
                                  bid.memberName
                                )
                              }
                            >
                              납부완료(상세)
                            </Button>
                            <Modal
                              open={open}
                              onClose={handleClose}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                <Typography
                                  id="modal-modal-title"
                                  variant="h6"
                                  component="h2"
                                >
                                  <h3 className="payment-title">결제정보</h3>
                                </Typography>
                                <Typography
                                  id="modal-modal-description"
                                  sx={{ mt: 2 }}
                                >
                                  <p>상품명 : {paymentInfo.productName}</p>
                                  <p>결제번호 : {paymentInfo.tradeNo} </p>
                                  <p>구매자 : {bid.memberName}</p>
                                  <p>결제금액 : {bid.bidAmount}</p>
                                  <p>결제일시 : {paymentInfo.paymentDate}</p>
                                </Typography>
                              </Box>
                            </Modal>
                          </>
                        ) : bid.bidState === "5" ? (
                          "미납부"
                        ) : (
                          "경매취소(관리자)"
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bid-log-paging">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </div>
  );
};

export default MemberBid;
