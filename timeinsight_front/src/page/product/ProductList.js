import { useEffect, useState } from "react";
import { Button1 } from "../../component/FormFrm";
import axios from "axios";
import Pagination from "../common/Pagination";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const ProductList = (props) => {
  const { what } = useParams(); // URL에서 카테고리 파라미터를 읽어옵니다.
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCategory = props.selectedCategory;
  const setSelectedCategory = props.setSelectedCategory;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [totalTime, setTotalTime] = useState(0);

  //최신순, 인기순
  const [filter, setFilter] = useState(0);

  const handleChange = (event) => {
    setFilter(event.target.value);
  };
  // 총 소요 시간 형식화 함수
  const formatTotalTime = (totalTime) => {
    return totalTime.toLocaleString(); // 쉼표로 구분된 형식으로 변환
  };

  useEffect(() => {
    axios
      .get(
        backServer +
          "/product/list/" +
          selectedCategory +
          "/" +
          reqPage +
          "/" +
          filter
      )
      .then((res) => {
        setProductList(res.data.data.productList);
        setPageInfo(res.data.data.pi);
        setTotalTime(res.data.data.totalTime);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage, selectedCategory, filter]);

  return (
    <>
      <div className="product-title">
        <p>
          총 {formatTotalTime(totalTime)}시간의 소중한 만남이 기다리고 있습니다.
        </p>
        <Select id="demo-simple-select" value={filter} onChange={handleChange}>
          <MenuItem value={0}>최신순</MenuItem>
          <MenuItem value={1}>감정가순</MenuItem>
        </Select>
      </div>
      <div className="product-list-wrap">
        {productList.map((product, index) => {
          return <ProductItem key={"product" + index} product={product} />;
        })}
      </div>
      <div className="product-page">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </>
  );
};

const ProductItem = (props) => {
  const product = props.product;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const productDetail = (productNo) => {
    navigate("/productDetail/" + productNo);
  };
  return (
    <div className="product-item">
      <div
        className="product-item-img"
        onClick={() => productDetail(product.productNo)}
      >
        {product.expertThumbnail === null ? (
          <img src="/image/default2.png" />
        ) : (
          <img
            src={backServer + "/product/expert/" + product.expertThumbnail}
          />
        )}
      </div>
      <div className="product-item-info">
        <div className="product-item-title">{product.productName}</div>
        <div className="product-sub-wrap">
          <div className="product-item-expert">
            {product.startingPrice.toLocaleString() + "원" + "🔺"}
          </div>
          <div className="product-item-expert">{product.expertName}</div>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
