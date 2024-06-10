import { useEffect, useState } from "react";
import { Button1, Button2, Button3, Input } from "../../component/FormFrm";

const Main = () => {
  useEffect(() => {
    function showTime() {
      const date = new Date();
      let h = date.getHours(); // 0 - 23
      let m = date.getMinutes(); // 0 - 59
      let s = date.getSeconds(); // 0 - 59
      let session = "AM";

      if (h === 0) {
        h = 12;
      }

      if (h > 12) {
        h -= 12;
        session = "PM";
      }

      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;

      const time = h + ":" + m + ":" + s + " " + session;
      const clockDisplay = document.getElementById("MyClockDisplay");

      if (clockDisplay) {
        clockDisplay.innerText = time;
        clockDisplay.textContent = time;
      }
    }

    const intervalId = setInterval(showTime, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div id="main-wrap" className="main-background">
        <div id="MyClockDisplay" className="clock"></div>
        <p>
          시간을 선택하는 것이 시간을 절약하는 것이다.
          <br /> <span style={{ fontSize: "14px", fontFamily: "ns-l" }}></span>
        </p>
      </div>
    </>
  );
};

export default Main;
