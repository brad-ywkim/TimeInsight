import { useState } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Button from "@mui/material/Button";

const ProgressTap = (props) => {
  const { currentTab, tabMenu, setTabMenu, setCurrentTab, setReqPage } = props;

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activeButton,
    setActiveButton,
    setCurrentStatus,
  } = props;

  const selectMenuHandler = (index) => {
    setCurrentTab(index);
    //값초기화
    setReqPage(1);
    setCurrentStatus(index);
    const today = dayjs();
    const twoMonthAgo = today.subtract(2, "month");
    setStartDate(twoMonthAgo);
    setEndDate(today);
    setActiveButton("twoMonth");
  };

  return (
    <>
      <div className="history-menu-wrap">
        <ul>
          {tabMenu.map((item, index) => (
            <li
              key={"tab" + index}
              className={
                index === currentTab //선택한 탭과 동일하다면,
                  ? "history-menu history-menu-focus refund-menu refund-menu-focus"
                  : "history-menu refund-menu "
              }
              onClick={() => selectMenuHandler(index)}
            >
              {item}
            </li>
          ))}
        </ul>
        <DateSelect
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setReqPage={setReqPage}
        />
      </div>
    </>
  );
};

const DateSelect = (props) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activeButton,
    setActiveButton,
    setReqPage,
  } = props;

  // 2개월 버튼 클릭 시
  const twoMonth = () => {
    const today = dayjs();
    const twoMonthAgo = today.subtract(2, "month");
    setStartDate(twoMonthAgo);
    setEndDate(today);
    setActiveButton("twoMonth");
    setReqPage(1);
  };

  // 6개월 버튼 클릭 시
  const sixMonth = () => {
    const today = dayjs();
    const sixMonthsAgo = today.subtract(6, "month");
    setStartDate(sixMonthsAgo);
    setEndDate(today);
    setActiveButton("sixMonth");
    setReqPage(1);
  };

  // 전체 버튼 클릭 시
  const projectStartDate = dayjs("2020-01-01");
  const all = () => {
    // 전체 기간을 원하는 날짜로 설정
    const today = dayjs();
    setStartDate(projectStartDate);
    setEndDate(today);
    setActiveButton("all");
    setReqPage(1);
  };

  const nonActive = () => {
    setActiveButton("none"); // 버튼활성해제
    setReqPage(1);
  };

  return (
    <div className="history-date-select-wrap ">
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        dateFormats={{ monthShort: "M" }}
      >
        <DemoContainer components={["DatePicker", "DatePicker"]}>
          <div className="history-date-select-btn-box">
            <button
              onClick={twoMonth}
              className={
                activeButton === "twoMonth"
                  ? "date-select-active"
                  : "date-select-btn"
              }
            >
              최근 2개월
            </button>
            <button
              onClick={sixMonth}
              className={
                activeButton === "sixMonth"
                  ? "date-select-active"
                  : "date-select-btn"
              }
            >
              6개월
            </button>
            <button
              onClick={all}
              className={
                activeButton === "all"
                  ? "date-select-active"
                  : "date-select-btn"
              }
            >
              전체
            </button>
          </div>
          <DatePicker
            views={["year", "month", "day"]}
            label="시작날짜"
            value={startDate}
            format="YYYY/MM/DD"
            mask={"____/__/__"}
            showDaysOutsideCurrentMonth
            onChange={(date) => {
              setStartDate(date);
              nonActive();
            }}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            minDate={projectStartDate}
            maxDate={endDate}
          />
          <DatePicker
            views={["year", "month", "day"]}
            label="종료날짜"
            value={endDate}
            format="YYYY/MM/DD"
            mask={"____/__/__"}
            showDaysOutsideCurrentMonth
            onChange={(date) => {
              setEndDate(date);
              nonActive();
            }}
            slotProps={{
              textField: {
                size: "small",
              },
              actionBar: {
                actions: ["today"],
              },
            }}
            maxDate={dayjs()}
            minDate={startDate}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};
export default ProgressTap;
