import { useNavigate } from "react-router-dom";
import { Button1, Button3 } from "../../component/FormFrm";
import Pagination from "../common/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@mui/material";
import Swal from "sweetalert2";
const AdminProduct = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [selectedProductNo, setSelectedProductNo] = useState(null); // 선택된 전문가의 번호를 저장하는 상태

  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [productList, setProductList] = useState([]);
  const [productState, setProductState] = useState("1");
  const [bidCount, setBidCount] = useState(0);

  useEffect(() => {
    axios
      .get(backServer + "/admin/productList/" + reqPage)
      .then((res) => {
        console.log(res);
        setProductList(res.data.data.productList);
        setPageInfo(res.data.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, backServer]);

  const handleProductSelection = (productNo, bidCount, productState) => {
    setSelectedProductNo((prevSelected) =>
      prevSelected === productNo ? null : productNo
    );
    setBidCount(bidCount);
    setProductState(productState);
  };

  console.log("상태:", productState);
  console.log("입찰수:", bidCount);
  console.log("선택상품", selectedProductNo);

  const updateProduct = (productNo) => {
    if (productNo === null) {
      Swal.fire({
        title: "수정할 상품을 선택해주세요",
        icon: "error",
      });
    } else {
      navigate("/productUpdate/" + productNo);
    }
  };

  const productView = (productNo) => {
    navigate("/productDetail/" + productNo);
  };

  const cancleProduct = (productNo) => {
    if (productNo === null) {
      Swal.fire({
        title: "수정할 상품을 선택해주세요",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "정말 경매를 취소하시겠습니까?",
        text: "경매 취소시 신규등록을 진행하셔야 합니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "경매취소",
        cancelButtonText: "닫기",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .patch(backServer + "/admin/cancleProduct", { productNo })
            .then((res) => {
              console.log(res);
              if (res.data.message === "success") {
                Swal.fire({
                  title: "취소 성공",
                  icon: "success",
                }).then(() => {
                  setProductList((prevProductList) =>
                    prevProductList.map((product) =>
                      product.productNo === productNo
                        ? { ...product, productState: "5" }
                        : product
                    )
                  );
                });
              } else {
                Swal.fire({
                  title: "취소 실패",
                  text: "입찰자가 있는 경우 취소가 불가합니다.",
                  icon: "error",
                });
              }
            })
            .catch((res) => {
              console.log(res);
            });
        }
      });
    }
  };
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">상품관리</div>
      <div className="expert-wrap">
        <div className="product-enroll-btn">
          {productState === "1" && bidCount === 0 ? (
            <>
              <Button1
                text="상품수정"
                clickEvent={() => updateProduct(selectedProductNo)}
              />
              <Button1
                text="경매취소"
                clickEvent={() => cancleProduct(selectedProductNo)}
              />
            </>
          ) : (
            <Button1 text="변경불가" />
          )}
        </div>
        <table className="expert-tbl">
          <thead>
            <tr>
              <th>상품</th>
              <th>상품명</th>
              <th>전문가</th>
              <th>진행일정</th>
              <th>입찰상태</th>
              <th>입찰인원</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((p, index) => {
              return (
                <tr key={"p" + index}>
                  <td onClick={() => productView(p.productNo)}>
                    <img
                      src={
                        p.expertThumbnail === null
                          ? "/image/default2.png"
                          : backServer + "/product/expert/" + p.expertThumbnail
                      }
                      alt="썸네일"
                      width={"75px"}
                    />
                  </td>
                  <td>{p.productName}</td>
                  <td>{p.expertName}</td>
                  <td>{p.productDate}</td>
                  <td>
                    {p.productState === "1" ? (
                      <span style={{ color: "blue" }}>입찰중</span>
                    ) : p.productState === "2" ? (
                      <span style={{ color: "black" }}>납부대기</span>
                    ) : p.productState === "3" ? (
                      "납부완료"
                    ) : p.productState === "4" ? (
                      "경매취소(미참여)"
                    ) : p.productState === "5" ? (
                      "경매취소(미납)"
                    ) : (
                      "경매취소(관리자)"
                    )}
                  </td>
                  <td>{p.bidCount === 0 ? "-" : p.bidCount + "인"}</td>

                  <td>
                    <Checkbox
                      checked={selectedProductNo === p.productNo}
                      onChange={() =>
                        handleProductSelection(
                          p.productNo,
                          p.bidCount,
                          p.productState
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
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
export default AdminProduct;
