import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./expert.css";
import { useState } from "react";
import dayjs from "dayjs";
import ExpertFrm from "./ExpertFrm";
import axios from "axios";
const ExpertWrite = (props) => {
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //로그인 해제 시 메인 이동
  if (!isLogin) {
    Swal.fire("로그인 후 이용하세요.").then(() => {
      navigate("/");
    });
  }

  //[데이터 전송용] 관리자에게 입력받을 항목 : 이름, 생년월일, 직업, 전화번호, 이메일, 첨부파일, 썸네일, 자기소개 -> state
  const [expertName, setExpertName] = useState("");
  const [expertBirthday, setExpertBirthday] = useState(dayjs("2023-11-07"));
  const [expertJob, setExpertJob] = useState("");
  const [expertPhone, setExpertPhone] = useState("");
  const [expertEmail, setExpertEmail] = useState("");
  const [thumbnail, setThumbnail] = useState(null); //없을 수 있으니, null로 시작
  const [expertIntro, setExpertIntro] = useState("");
  const [expertFile, setExpertFile] = useState([]); //첨부파일 여러개일 수 있으니, [] 배열

  //[화면 출력용] 썸네일 및 첨부파일 미리보기 용 (실제 변수명 동일) -> 화면전송에는 사용하지 않음
  const [expertThumbnail, setExpertThumbnail] = useState(null); //썸네일 미리보기용
  const [fileList, setFileList] = useState([]); //첨부파일 미리보기용
  const write = () => {
    if (
      expertName !== "" &&
      expertBirthday !== "" &&
      expertJob !== "" &&
      expertPhone !== "" &&
      expertEmail !== "" &&
      thumbnail !== null &&
      expertIntro !== "" &&
      expertFile !== null
    ) {
      //전송용 form 데이터 생성
      const form = new FormData();
      form.append("expertName", expertName);
      form.append("expertBirthday", expertBirthday.format("YYYY-MM-DD"));
      form.append("expertJob", expertJob);
      form.append("expertPhone", expertPhone);
      form.append("expertEmail", expertEmail);
      form.append("expertIntro", expertIntro);

      //썸네일은 첨부한 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }

      //첨부파일도 첨부된 갯수만큼 반복해서 추가
      for (let i = 0; i < expertFile.length; i++) {
        form.append("expertFile", expertFile[i]);
      }

      axios
        .post(backServer + "/product/expert", form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false, //thymeleaf에서의 enctype과 동일함
          },
        })
        .then((res) => {
          console.log(res.data.message);
          if (res.data.message === "success") {
            navigate("/admin/adminExpert");
          } else {
            Swal.fire("작성 중 문제가 발생했습니다.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Swal.fire("다입력해");
    }
  };

  // 글 쓰기 양식 컴포넌트를 따로 만든다.
  // 글 수정 때 재활용할 수 있기 때문이다.

  return (
    <div className="expert-write-wrap">
      <div className="expert-frm-title">전문가 등록</div>

      <ExpertFrm
        expertName={expertName}
        setExpertName={setExpertName}
        expertBirthday={expertBirthday}
        setExpertBirthday={setExpertBirthday}
        expertJob={expertJob}
        setExpertJob={setExpertJob}
        expertPhone={expertPhone}
        setExpertPhone={setExpertPhone}
        expertEmail={expertEmail}
        setExpertEmail={setExpertEmail}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        expertIntro={expertIntro}
        setExpertIntro={setExpertIntro}
        expertFile={expertFile}
        setExpertFile={setExpertFile}
        expertThumbnail={expertThumbnail}
        setExpertThumbnail={setExpertThumbnail}
        fileList={fileList}
        setFileList={setFileList}
        buttonFunction={write}
      />
    </div>
  );
};

export default ExpertWrite;
