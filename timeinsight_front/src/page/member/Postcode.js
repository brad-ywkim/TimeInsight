import React from "react";
import DaumPostcode from "react-daum-postcode";

const Postcode = () => {
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

    console.log(fullAddress); // 전체 주소 출력
    // 여기서 주소 관련 처리를 할 수 있습니다.
  };

  return (
    <DaumPostcode
      onComplete={handleComplete}
      className="post-code"
      style={{ height: "400px" }}
    />
  );
};

export default Postcode;
