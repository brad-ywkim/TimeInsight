import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./expert.css";
import { Button1, Button2, Button3, Input } from "../../component/FormFrm";

const ExpertDetail = (props) => {
  const isLogin = props.isLogin;
  const params = useParams();
  const expertNo = params.expertNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [expert, setExpert] = useState({});
  const [member, setMember] = useState(null);
  const navigate = useNavigate();
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
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          setMember(res.data.data);
          console.log("접속자: ", res.data.data);
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, []);

  const updateExpert = (expertNo) => {
    navigate("/expertUpdate/" + expertNo);
  };

  const backPage = () => {
    navigate(-1);
  };

  return (
    <div className="expert-frm-wrap">
      <div className="expert-frm-title">전문가 등록</div>
      <p className="expert-frm-subtitle">
        전문가의 정보를 정확히 입력해주세요.
      </p>
      <div className="expert-frm-top">
        <div className="expert-thumbnail">
          {expert.expertThumbnail === null ? (
            <img src="/image/default2.png" />
          ) : (
            <img
              src={backServer + "/product/expert/" + expert.expertThumbnail}
            />
          )}
        </div>

        <div className="expert-info">
          <table className="expert-info-tbl">
            <tbody>
              <tr className="expert-infro-tbl-tr">
                <td>
                  <label htmlFor="expertName">이름</label>
                  <Input type="text" data={expert.expertName} disabled={true} />
                </td>
                <td>
                  <label htmlFor="expertBirthday">생년월일</label>
                  <Input
                    type="text"
                    data={expert.expertBirthday}
                    disabled={true}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="expertJob">직업</label>
                  <Input type="text" data={expert.expertJob} disabled={true} />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertPhone">전화번호</label>
                  <Input
                    type="text"
                    data={expert.expertPhone}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertEmail">이메일</label>
                  <Input
                    type="text"
                    data={expert.expertEmail}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label
                    htmlFor="expertFile"
                    className="expertFile-label"
                  ></label>
                </td>
              </tr>
              <tr className="file-list">
                <td>
                  <label htmlFor="expertEmail">첨부파일</label>
                  <div className="file-zone">
                    {/* 배열이 아닌거에 map을 쓰면 문제됨 -> 따라서 검증하고 씀*/}
                    {expert.fileList && expert.fileList.length > 0 ? (
                      expert.fileList.map((file, index) => (
                        <FileItem key={"file" + index} file={file} />
                      ))
                    ) : (
                      <span>첨부파일이 없습니다.</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="expert-frm-bottom">
            <label htmlFor="expertIntro">소개</label>
            <div
              className="expert-intro"
              dangerouslySetInnerHTML={{ __html: expert.expertIntro }}
            />
          </div>
        </div>
      </div>
      <div className="expert-frm-btn-box">
        {member && member.memberNo === expert.expertWriter ? (
          <>
            <Button1
              text="수정"
              clickEvent={() => updateExpert(expert.expertNo)}
            />
            <Button3 text="취소" clickEvent={backPage} />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const file = props.file;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const fileDown = () => {
    axios
      .get(backServer + "/product/file/" + file.expertFileNo, {
        //aixos는 기본적으로 모든 응답을 json으로 처리
        //-> json처리가 불가하여, 파일형식으로 받음
        responseType: "blob",
      })
      .then((res) => {
        //서버에서 바이너리데이터 -> blob형태로 변경
        const blob = new Blob([res.data]);
        //blob 데이터를 다운로드 할 수 있는 임시링크 생성
        const fileObjectUrl = window.URL.createObjectURL(blob);
        //blob데이터를 다운로드할 링크 생성
        const link = document.createElement("a"); //a태그생성
        link.href = fileObjectUrl; //위에서 만든 파일링크와 ㅇㄴ결
        link.style.display = "none"; //화면에서는 안보이게 처리
        //다운로드할 파일이름 지정
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileObjectUrl);
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div className="expert-file">
      <span className="material-icons" onClick={fileDown}>
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};

export default ExpertDetail;
