import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button1, Button2, Button3, Button4 } from "../../component/FormFrm";
import ProductFrm from "./ProductFrm";
import Swal from "sweetalert2";

const ProductUpdate = (props) => {
  const isLogin = props.isLogin;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const productNo = params.productNo;
  const navigate = useNavigate();
  const [expert, setExpert] = useState({});

  //로그인 해제 시 메인 이동
  if (!isLogin) {
    Swal.fire("로그인 후 이용하세요.").then(() => {
      navigate("/");
    });
  }

  // 카테고리-------------------------------------
  const categorys = [
    { value: 1, label: "경제" },
    { value: 2, label: "비즈니스" },
    { value: 3, label: "IT" },
    { value: 4, label: "스포츠" },
    { value: 5, label: "음악" },
    { value: 6, label: "사진" },
  ];

  const time = [
    { value: 1, label: "1시간" },
    { value: 2, label: "2시간" },
    { value: 3, label: "3시간" },
    { value: 4, label: "4시간" },
    { value: 5, label: "5시간" },
  ];

  // [데이터 전송용] 상태 초기화
  const [categoryNo, setCategoryNo] = useState(1);
  const [productName, setProductName] = useState("");
  const [productDate, setProductDate] = useState(dayjs());
  const [productTime, setProductTime] = useState(1);
  const [productPlace, setProductPlace] = useState("");
  const [totalParticipants, setTotalParticipants] = useState(1);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [startingPrice, setStartingPrice] = useState(0);
  useEffect(() => {
    axios
      .get(backServer + "/product/detail/" + productNo)
      .then((res) => {
        console.log("수신 : ", res.data.data);
        const product = res.data.data;
        setProductName(product.productName);
        setProductDate(dayjs(product.productDate)); // dayjs 객체로 변환
        setProductTime(product.productTime);
        setProductPlace(product.productPlace);
        setCategoryNo(product.categoryNo);
        setTotalParticipants(product.totalParticipants);
        setEndDate(dayjs(product.endDate)); // dayjs 객체로 변환
        setStartingPrice(product.startingPrice);
        setExpert({
          expertThumbnail: product.expertThumbnail,
          expertIntro: product.expertIntro,
          expertName: product.expertName,
          expertJob: product.expertJob,
        });
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  const selectCategory = (event) => {
    setCategoryNo(event.target.value);
    console.log(event.target.value);
  };
  const selectTime = (event) => {
    setProductTime(event.target.value);
    console.log(event.target.value);
  };

  const update = () => {
    const product = { productNo, productName, productTime, productPlace };
    axios
      .patch(backServer + "/product/updateProduct", product)
      .then((res) => {
        Swal.fire({ icon: "success", title: "수정 완료" });
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <div className="product-write-wrap">
      <ProductFrm
        categoryNo={categoryNo}
        setCategoryNo={setCategoryNo}
        productName={productName}
        setProductName={setProductName}
        productDate={productDate}
        setProductDate={setProductDate}
        productTime={productTime}
        setProductTime={setProductTime}
        productPlace={productPlace}
        setProductPlace={setProductPlace}
        totalParticipants={totalParticipants}
        setTotalParticipants={setTotalParticipants}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startingPrice={startingPrice}
        setStartingPrice={setStartingPrice}
        expert={expert}
        buttonFunction={update}
        selectCategory={selectCategory}
        selectTime={selectTime}
        categorys={categorys}
        time={time}
        type="modify"
      />
    </div>
  );
};

export default ProductUpdate;
