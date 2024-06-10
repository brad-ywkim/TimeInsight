import { Input, Button1, Button2 } from "../../component/FormFrm";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./expert.css";
import ExpertFrm from "./ExpertFrm";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ExpertUpdate = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const expertNo = params.expertNo;
  const navigate = useNavigate();

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

  //[첨부파일 삭제 수정시]
  const [delFileNo, setDelFileNo] = useState([]); //기존 첨부파일을 삭제하면 파일번호를 저장해서 전달할 state

  //[썸네일 수정 체크용]
  const [thumbnailCheck, setThumbnailCheck] = useState(0); //썸네일 변경 여부
  const [oldThumbnail, setOldThumbnail] = useState(null); //기존 썸네일 저장소

  const modifyExpert = () => {
    console.log("삭제", delFileNo);
    console.log("썸네일", expertThumbnail);
    console.log("이름", expertName);
    console.log("생일", dayjs(expertBirthday));
    console.log("직업", expertJob);
    console.log("이메일", expertEmail);
    console.log("전화", expertPhone);
    console.log("파일", fileList);
    console.log("소개", expertIntro);

    //전송용 form 데이터 생성
    const form = new FormData();
    form.append("expertNo", expertNo);
    form.append("expertName", expertName);
    form.append("expertBirthday", expertBirthday.format("YYYY-MM-DD")); //서버로 보낼 때:format('yyyy-mm-dd'), 서버로부터받을 때:dayjs
    form.append("expertJob", expertJob);
    form.append("expertPhone", expertPhone);
    form.append("expertEmail", expertEmail);
    form.append("expertIntro", expertIntro);
    form.append("thumbnailCheck", thumbnailCheck);
    form.append("expertThumbnail", oldThumbnail);

    //썸네일 수정하면 추가
    if (thumbnail !== null) {
      form.append("thumbnail", thumbnail);
    }
    //첨부파일이 추가되면 전송
    for (let i = 0; i < expertFile.length; i++) {
      form.append("expertFile", expertFile[i]);
    }
    //삭제한 파일번호 배열 전송
    for (let i = 0; i < delFileNo.length; i++) {
      form.append("delFileNo", delFileNo[i]);
    }

    axios
      .patch(backServer + "/product/expert", form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === "success") {
          Swal.fire("수정이 완료되었습니다.").then(() => {
            navigate("/admin/adminExpert");
          });
        } else {
          Swal.fire("수정 중 문제가 발생했습니다.").then(() => {
            navigate("/admin/adminExpert");
          });
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
        console.log("수신 : ", res.data.data);

        const expert = res.data.data;
        setExpertName(expert.expertName);
        setExpertBirthday(dayjs(expert.expertBirthday)); //dayjs 로 작업
        setExpertJob(expert.expertJob);
        setExpertPhone(expert.expertPhone);
        setExpertEmail(expert.expertEmail);
        setFileList(expert.fileList);
        setOldThumbnail(expert.expertThumbnail);
        setExpertIntro(expert.expertIntro);
        setExpertThumbnail(expert.expertThumbnail);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  // 글 쓰기 양식 컴포넌트를 따로 만든다.
  // 글 수정 때 재활용할 수 있기 때문이다.
  return (
    <div className="expert-write-wrap">
      <div className="expert-frm-title">전문가 수정</div>
      <p className="expert-frm-subtitle">수정할 정보를 정확히 입력해주세요.</p>
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
        //수정기능:추가된 부분
        type="modify"
        buttonFunction={modifyExpert}
        delFileNo={delFileNo} //삭제할 파일 배열
        setDelFileNo={setDelFileNo}
        thumbnailCheck={thumbnailCheck}
        setThumbnailCheck={setThumbnailCheck}
      />
    </div>
  );
};

export default ExpertUpdate;
