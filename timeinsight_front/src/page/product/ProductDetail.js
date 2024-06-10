import { Input } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button1,
  Button2,
  Button3,
  Button4,
  Select,
} from "../../component/FormFrm";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { format, parseISO } from "date-fns";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ProductDetail = (props) => {
  const isLogin = props.isLogin;
  const params = useParams();
  const productNo = params.productNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [member, setMember] = useState({});
  const [memberNo, setMemberNo] = useState();
  const [bidState, setBidState] = useState();
  const [bidNo, setBidNo] = useState();
  const [today, setToday] = useState();
  const [endDate, setEndDate] = useState();
  const [bidAmount, setBidAmount] = useState();
  const [startingPrice, setStartingPrice] = useState();
  // 로그인 상태일 때 회원 번호를 먼저 가져오는 useEffect

  useEffect(() => {
    if (isLogin) {
      axios.get(backServer + "/member").then((res) => {
        setToday(dayjs().format("YYYY-MM-DD"));
        setMemberNo(res.data.data.memberNo);
      });
    }
  }, [isLogin, backServer, today]);
  // memberNo가 설정된 후 제품 상세 정보를 가져오는 useEffect
  useEffect(() => {
    if (memberNo !== undefined) {
      // memberNo가 정의된 후에 실행
      axios
        .get(backServer + "/product/detail/" + productNo + "/" + memberNo)
        .then((res) => {
          console.log("Product:", res.data.data);
          setToday(dayjs().format("YYYY-MM-DD"));
          setProduct(res.data.data);
          setBidState(res.data.data.bidState);
          setBidAmount(res.data.data.bidAmount);
          setBidNo(res.data.data.bidNo);
          setEndDate(res.data.data.endDate);
          setStartingPrice(res.data.data.startingPrice);
          setBidNo(res.data.data.bidNo);
        })
        .catch((error) => {
          console.error("fail:", error);
        });
    }
  }, [memberNo, productNo, backServer]);

  // 로그인 상태가 아닐 때 바로 제품 정보를 가져오는 로직은 그대로 유지
  useEffect(() => {
    if (!isLogin) {
      axios.get(backServer + "/product/detail/" + productNo).then((res) => {
        setToday(dayjs().format("YYYY-MM-DD"));
        setProduct(res.data.data);

        setBidState(res.data.data.bidState);
        setEndDate(res.data.data.endDate);
      });
    }
  }, [isLogin, productNo, backServer, today]);

  const bid = (productNo) => {
    navigate("/bid/" + productNo);
  };

  const login = () => {
    navigate("/login");
  };

  const cancleBid = (bidNo) => {
    Swal.fire({
      text: "입찰참여를 취소하시겠습니까?",
      icon: "question",
      confirmButtonText: "참여취소",
      showCancelButton: true,
      cancelButtonText: "닫기",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            backServer + "/bid/cancle",
            { bidNo: bidNo },
            {
              headers: {
                ContentType: "application/json",
                prodcessData: false,
              },
            }
          )
          .then((res) => {
            if (res.data.message === "success") {
              console.log("입찰 취소 성공: ", res);
              setBidState(6);
            } else {
              console.log("입찰 취소 실패: ", res);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  };
  const updateBid = (bidNo, startingPrice, bidAmount) => {
    Swal.fire({
      input: "text",
      title: "입찰수정",
      inputLabel:
        "현재 고객님의 입찰희망가는 " +
        bidAmount.toLocaleString() +
        "원입니다.",
      confirmButtonText: "수정",
      cancelButtonText: "취소",
      inputPlaceholder:
        "최소 입찰 금액은 " + startingPrice.toLocaleString() + "원입니다.",
      inputAttributes: {
        "aria-label": "Type your message here",
        min: startingPrice,
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "입찰 금액을 입력해주세요!";
        }
        const inputBidAmount = parseInt(value.replace(/,/g, ""), 10);
        if (inputBidAmount < startingPrice) {
          return (
            "최소 입찰금액은" + startingPrice.toLocaleString() + "원입니다."
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result.value);
        const inputBidAmount = parseInt(result.value.replace(/,/g, ""), 10);
        const bid = { bidNo, bidAmount: inputBidAmount };
        axios
          .patch(backServer + "/bid/update", bid, {
            headers: {
              ContentType: "application/json",
            },
          })
          .then((res) => {
            console.log(res);
            Swal.fire({
              title: "수정 성공",
              icon: "success",
            }).then(() => {
              navigate("/productDetail/" + productNo);
              setBidAmount(result.value);
            });
          })
          .catch((res) => {
            console.error(res);
          });
      }
    });
  };
  return (
    <div className="product-write-wrap">
      <h3>상품상세</h3>
      <div className="product-frm-wrap">
        <div className="product-frm-top">
          <div className="product-thumbnail">
            <div className="product-detail-thumbnail">
              <img
                src={backServer + "/product/expert/" + product.expertThumbnail}
              />
            </div>
            <div
              className="product-expert-intro"
              dangerouslySetInnerHTML={{ __html: product.expertIntro }}
            ></div>
          </div>

          <div className="product-info">
            <table className="product-tbl">
              <tbody>
                <tr>
                  <td>{product.productName}</td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="productCategory">카테고리</label>
                    <span>{product.categoryName}</span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <label htmlFor="expertName">이름</label>
                    <span>{product.expertName}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="expertJob">직업</label>
                    <span>{product.expertJob}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="productDate">미팅일정</label>
                    <span>{product.productDate}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="productTime">진행시간</label>
                    <span>{product.productTime}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="productPlace">장소</label>
                    <span>{product.productPlace}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="totalParticipatns">모집인원</label>
                    <span>{product.totalParticipants}</span>
                  </td>
                </tr>
                <tr>
                  <td className="date-wrap">
                    <label htmlFor="endDate">입찰마감일</label>
                    <span>{product.endDate}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="productName">최소입찰가</label>
                    <span>{product.startingPrice}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    {today <= endDate ? (
                      isLogin ? (
                        bidState === 0 || bidState === 6 ? (
                          <Button1
                            text="입찰신청"
                            id="enroll-btn"
                            clickEvent={() => bid(productNo)}
                          />
                        ) : bidState === 1 ? (
                          <div className="product-detail-btn-wrap">
                            <Button1
                              text="입찰취소"
                              clickEvent={() => cancleBid(bidNo)}
                              id="cancleBidBtn"
                            />
                            <Button2
                              text="입찰가 수정"
                              clickEvent={() =>
                                updateBid(
                                  bidNo,
                                  startingPrice,
                                  bidAmount,
                                  setBidAmount
                                )
                              }
                              id="updateBidBtn"
                            />
                          </div>
                        ) : (
                          (bidState === 2 ||
                            bidState === 3 ||
                            bidState === 4 ||
                            bidState === 5) && <Button3 text="입찰마감" />
                        )
                      ) : (
                        <Button2
                          text="로그인 후 이용해주세요."
                          clickEvent={login}
                        />
                      )
                    ) : (
                      <Button4 text="경매종료" />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
