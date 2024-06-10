import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button1, Button3, Input } from "../../component/FormFrm";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const Bid = (props) => {
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const params = useParams();
  const productNo = params.productNo;
  const [member, setMember] = useState({});
  const [product, setProduct] = useState({});
  const [endDate, setEndDate] = useState();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //데이터 전송용
  const [bidAmount, setBidAmount] = useState();

  const bid = {
    bidAmount: bidAmount,
    productNo: productNo,
    endDate: endDate,
  };

  if (!isLogin) {
    Swal.fire("로그인 후 이용해주세요.").then((res) => {
      navigate("/");
    });
  }

  useEffect(() => {
    axios
      .get(backServer + "/product/detail/" + productNo)
      .then((res) => {
        console.log("상품", res);
        setBidAmount(res.data.data.startingPrice);
        setProduct(res.data.data);
        setEndDate(res.data.data.endDate);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const enrollbid = () => {
    axios
      .post(backServer + "/bid", bid)
      .then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "입찰참가 신청완료",
            text: "마이페이지-입찰내역을 확인하세요.",
            icon: "success",
          }).then(() => {
            navigate("/productDetail/" + productNo);
          });
        } else {
          Swal.fire({
            title: "입찰참가 신청실패",
            text: "잠시 후 다시 시도해주세요.",
            icon: "success",
          });
        }
      })
      .catch((res) => {
        console.log("입찰신청 에러 :", res);
      });
  };

  return (
    <div className="bid-wrap">
      <div className="bid-title">
        <p>입찰신청</p>
      </div>

      <div className="bid-content-top-wrap">
        <div className="bid-product-thumbnail">
          <img
            src={backServer + "/product/expert/" + product.expertThumbnail}
          />
        </div>
        <div className="bid-product-title">{product.productName}</div>
      </div>
      <div className="bid-content-wrap">
        <div className="bid-product-info">
          <span>상세정보</span>
          <span>▫️ 상품명 : {product.productName}</span>
          <span>▫️ 전문가 : {product.expertName}</span>
          <span>▫️ 미팅일정 : {product.productDate}</span>
          <span>▫️ 진행시간 : {product.productTime}시간</span>
          <span>▫️ 장소 : {product.productPlace}</span>
          <span>
            ▫️ 최소입찰가 : {product?.startingPrice?.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className="bid-product-price">
        <span>입찰희망금액</span>
        <Input
          type="text"
          id="bidPrice"
          data={bidAmount}
          setData={setBidAmount}
        />
      </div>
      <div className="bid-product-caution">
        <span>유의사항</span>
        <span>
          경매 참여 전에는 전문가의 평가 및 이력을 꼼꼼히 확인하시기 바랍니다.
          <br />
          더불어 미팅일정 및 장소 등 상품의 정확한 정보를 확인하신 후 입찰신청을
          하시기 바랍니다.
          <br />본 상품의 입찰최소금액은 입찰시작가인{" "}
          {product?.startingPrice?.toLocaleString()}원 입니다.
        </span>
      </div>
      <div className="bid-btn-wrap">
        <Button1
          text="입찰하기"
          clickEvent={() => {
            enrollbid();
          }}
        />
        <Button3 text="취소"></Button3>
      </div>
    </div>
  );
};

export default Bid;
