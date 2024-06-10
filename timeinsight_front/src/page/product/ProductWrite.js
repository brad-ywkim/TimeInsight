import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductFrm from "./ProductFrm";
import "./product.css";

const ProductWrite = (props) => {
  const isLogin = props.isLogin;
  const location = useLocation();
  const expertNo = location.state.selectedExpertNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [expert, setExpert] = useState({});
  const navigate = useNavigate();
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

  const selectCategory = (event) => {
    setCategoryNo(event.target.value);
    console.log(event.target.value);
  };

  const selectTime = (event) => {
    setProductTime(event.target.value);
    console.log(event.target.value);
  };

  //전송용
  const [categoryNo, setCategoryNo] = useState(1);
  const [productName, setProductName] = useState("");
  const [productDate, setProductDate] = useState(dayjs());
  const [productTime, setProductTime] = useState(1);
  const [productPlace, setProductPlace] = useState("");
  const [totalParticipants, setTotalParticipants] = useState(1);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [startingPrice, setStartingPrice] = useState();

  //전송용 데이터
  const product = {
    expertNo: expertNo,
    categoryNo: categoryNo,
    productName: productName,
    productDate: productDate.format("YYYY-MM-DD"),
    productTime: productTime,
    productPlace: productPlace,
    totalParticipants: totalParticipants,
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    startingPrice: startingPrice,
  };

  const write = () => {
    axios
      .post(backServer + "/product", product)
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === "success") {
          navigate("/product/all");
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  useEffect(() => {
    axios
      .get(backServer + "/product/expertDetail/" + expertNo)
      .then((res) => {
        console.log("전문가: ", res.data.data);
        setExpert(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  return (
    <div className="product-write-wrap">
      <div className="product-frm-title">상품 등록</div>
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
        buttonFunction={write}
        selectCategory={selectCategory}
        selectTime={selectTime}
        categorys={categorys}
        time={time}
        type="write"
      />
    </div>
  );
};

export default ProductWrite;
