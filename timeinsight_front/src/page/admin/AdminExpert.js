import { useEffect, useState } from "react";
import { Button1, Button3 } from "../../component/FormFrm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Swal from "sweetalert2";
import Pagination from "../common/Pagination";

const AdminExpert = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [expertList, setExpertList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [selectedExpertNo, setSelectedExpertNo] = useState(null); // 선택된 전문가의 번호를 저장하는 상태
  const navigate = useNavigate();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  useEffect(() => {
    axios
      .get(backServer + "/admin/expertList/" + reqPage)
      .then((res) => {
        setExpertList(res.data.data.expertList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);

  const handleExpertSelection = (expertNo) => {
    setSelectedExpertNo((prevSelected) =>
      prevSelected === expertNo ? null : expertNo
    );
  };

  const insertExpert = () => {
    navigate("/expertWrite");
  };

  const insertProduct = () => {
    if (selectedExpertNo === null) {
      Swal.fire({
        title: "전문가 선택 필수!",
        text: "상품등록을 위한 전문가를 선택하세요.",
        icon: "warning",
        confirmButtonText: "Cool",
      });
    } else {
      navigate("/productWrite", {
        state: { selectedExpertNo: selectedExpertNo }, //useLocation
      });
    }
  };
  const expertView = (expertNo) => {
    navigate("/expertDetail/" + expertNo); //useParams
  };
  console.log("선택된 전문가 : ", selectedExpertNo);
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">전문가 관리</div>
      <div className="expert-wrap">
        <div className="product-enroll-btn">
          <Button1 text="전문가등록" clickEvent={insertExpert} />
          <Button3 text="상품등록" clickEvent={insertProduct} />
        </div>
        <p>전문가 등록 후 상품을 등록해주세요.</p>
        <table className="expert-tbl">
          <thead>
            <tr>
              <th colSpan={2}>전문가</th>
              <th>생년월일</th>
              <th>직업</th>
              <th>이메일</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            {expertList.map((expert, index) => {
              return (
                <tr key={index}>
                  <td onClick={() => expertView(expert.expertNo)}>
                    <img
                      src={
                        expert.expertThumbnail === null
                          ? "/image/default2.png"
                          : backServer +
                            "/product/expert/" +
                            expert.expertThumbnail
                      }
                      alt="썸네일"
                      width={"75px"}
                    />
                  </td>
                  <td>{expert.expertName}</td>
                  <td>{expert.expertBirthday}</td>
                  <td>{expert.expertJob}</td>
                  <td>{expert.expertEmail}</td>
                  <td>
                    <Checkbox
                      checked={selectedExpertNo === expert.expertNo}
                      onChange={() => handleExpertSelection(expert.expertNo)}
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
export default AdminExpert;
