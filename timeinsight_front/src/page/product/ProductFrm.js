import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Button1,
  Button2,
  Button3,
  Input,
  Select,
} from "../../component/FormFrm";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
const ProductFrm = (props) => {
  const {
    categoryNo,
    setCategoryNo,
    productName,
    setProductName,
    productDate,
    setProductDate,
    productTime,
    setProductTime,
    productPlace,
    setProductPlace,
    totalParticipants,
    setTotalParticipants,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startingPrice,
    setStartingPrice,
    expert,

    categorys,
    selectCategory,
    selectTime,
    buttonFunction,
    time,
    type,
  } = props;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const backPage = () => {
    navigate(-1);
  };

  // 다음 주소 API
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

    setProductPlace(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  return (
    <div className="product-frm-wrap">
      <div className="product-frm-title">
        {type === "modify" ? "상품 수정" : "상품등록"}
      </div>
      <div className="product-frm-top">
        <div className="product-thumbnail">
          <div className="product-enroll-thumbnail-wrap">
            <img
              src={backServer + "/product/expert/" + expert.expertThumbnail}
            />
          </div>
          <div
            className="product-expert-intro"
            dangerouslySetInnerHTML={{ __html: expert.expertIntro }}
          ></div>
        </div>
        <div className="product-info">
          <table className="product-info-tbl">
            <tbody>
              <tr>
                <td className="product-select">
                  <label htmlFor="productName">카테고리</label>
                  <Select
                    options={categorys}
                    changeEvent={selectCategory}
                    value={categoryNo}
                    disabled={type === "modify" ? true : false}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="productName">상품명</label>
                  <Input
                    type="text"
                    data={productName}
                    setData={setProductName}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertName">이름</label>
                  <Input
                    type="text"
                    id="exertName"
                    data={expert.expertName}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertJob">직업</label>
                  <Input
                    type="text"
                    data={expert.expertJob}
                    id="expertJob"
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td className="date-wrap">
                  <label htmlFor="productDate">미팅일정</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        value={productDate}
                        onChange={(date) => setProductDate(date)}
                        disabled={type === "modify" ? true : false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </td>
              </tr>
              <tr>
                <td className="product-select">
                  <label htmlFor="productTime">진행시간</label>
                  <Select
                    options={time}
                    changeEvent={selectTime}
                    value={productTime}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="productPlace">장소</label>
                  <div className="productPlace-wrap">
                    <Input
                      type="text"
                      data={productPlace}
                      setData={setProductPlace}
                    />
                    <Button3
                      type="button"
                      text="검색"
                      id="post-find"
                      clickEvent={handleClick}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="totalParticipatns">모집인원</label>
                  <Input
                    type="text"
                    id="totalParticipatns"
                    data={totalParticipants}
                    setData={setTotalParticipants}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td className="date-wrap">
                  <label htmlFor="endDate">입찰마감일</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        disabled={type === "modify" ? true : false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="productName">최초 감정가</label>
                  <Input
                    type="text"
                    data={startingPrice}
                    setData={setStartingPrice}
                    disabled={type === "modify" ? true : false}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="product-frm-btn-box">
            {type === "modify" ? (
              <>
                <Button1 text="수정" clickEvent={buttonFunction} />
                <Button3 text="취소" clickEvent={backPage} />{" "}
              </>
            ) : (
              <>
                <Button1 text="등록" clickEvent={buttonFunction} />
                <Button3 text="취소" clickEvent={backPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFrm;
