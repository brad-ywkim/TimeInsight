import { Button1, Button2, Button3, Input } from "../../component/FormFrm";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextEditor from "../../component/TextEditor";
import { useState } from "react";

const ExpertFrm = (props) => {
  const {
    // 데이터 전송용
    expertName,
    setExpertName,
    expertBirthday,
    setExpertBirthday,
    expertJob,
    setExpertJob,
    expertPhone,
    setExpertPhone,
    expertEmail,
    setExpertEmail,
    thumbnail,
    setThumbnail,
    expertIntro,
    setExpertIntro,
    expertFile,
    setExpertFile,

    // 화면 출력용
    expertThumbnail,
    setExpertThumbnail,
    fileList,
    setFileList,

    //클릭시 동작할 함수
    buttonFunction,
    //수정에 따른 추가사항
    type,
    delFileNo,
    setDelFileNo,
    thumbnailCheck,
    setThumbnailCheck,
  } = props;

  //첨부파일 추가 시 화면에 보여줄 state
  const [newFileList, setNewFileList] = useState([]);

  const backServer = process.env.REACT_APP_BACK_SERVER;

  //썸네일 파일 추가시 동작할 함수
  const changeThumbnail = (e) => {
    const files = e.target.files;
    //파일이 1개라도 선택되었는 지&&파일이 비정상
    if (files.length !== 0 && files[0] != 0) {
      if (type === "modify") {
        setThumbnailCheck(1);
      }
      setThumbnail(files[0]); //전송용 state에 file 객체를 생성

      //화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setExpertThumbnail(reader.result);
      };
    } else {
      //파일을 취소눌렀을 때
      setThumbnail(null);
      setExpertThumbnail(null);
    }
  };

  // ---------------------------------------파일첨부
  const changeFile = (e) => {
    const files = e.target.files; //배열처럼 생겼지만, map이나 foreach쓰면 안됨 -> filelist라는 독특한 객체
    console.log("파일객체 : ", files);
    //[전송용]은 expertFile에 넣어주고, [출력용]은 하나하나 fileList에 넣는다.
    setExpertFile(files);
    const arr = new Array();
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i].name);
    }
    setNewFileList(arr); //출력용
  };

  return (
    <div className="expert-frm-wrap">
      <div className="expert-frm-top">
        <div className="expert-thumbnail">
          {/* 1. null인경우: 기본이미지 
          2. type==="modify" && thumbnail===0: 기존이미지
          3. backServer + "/product/expert"
            */}

          {expertThumbnail === null ? (
            <img src="/image/default1.png" />
          ) : type === "modify" && thumbnailCheck === 0 ? (
            <img src={backServer + "/product/expert/" + expertThumbnail} />
          ) : (
            <img src={expertThumbnail} />
          )}

          <label htmlFor="thumbnail">+ 사진 등록</label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={changeThumbnail}
          />
        </div>

        <div className="expert-info">
          <table className="expert-info-tbl">
            <tbody>
              <tr className="expert-infro-tbl-tr">
                <td>
                  <label htmlFor="expertName">이름</label>
                  <Input
                    type="text"
                    data={expertName}
                    setData={setExpertName}
                    id="expertName"
                    disabled={type === "modify" ? true : false}
                  />
                </td>
                <td>
                  <label htmlFor="expertBirthday">생년월일</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        value={expertBirthday}
                        onChange={(date) => setExpertBirthday(date)}
                        disabled={type === "modify" ? true : false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="expertJob">직업</label>
                  <Input
                    type="text"
                    data={expertJob}
                    setData={setExpertJob}
                    id="expertJob"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertPhone">전화번호</label>
                  <Input
                    type="text"
                    data={expertPhone}
                    setData={setExpertPhone}
                    id="expertPhone"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertEmail">이메일</label>
                  <Input
                    type="text"
                    data={expertEmail}
                    setData={setExpertEmail}
                    id="expertEmail"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="expertFile" className="expertFile-label">
                    💾 첨부파일 업로드 ({expertFile.length + fileList.length}건)
                  </label>
                  <input
                    type="file"
                    id="expertFile"
                    onChange={changeFile}
                    multiple
                  />
                </td>
              </tr>
              <tr className="file-list">
                <td>
                  <div className="file-zone">
                    {type === "modify"
                      ? fileList.map((file, index) => {
                          return (
                            <FileItem
                              key={"oldFile" + index}
                              file={file}
                              fileList={fileList}
                              setFileList={setFileList}
                              delFileNo={delFileNo}
                              setDelFileNo={setDelFileNo}
                            />
                          );
                        })
                      : ""}

                    {newFileList.map((item, index) => {
                      return (
                        <p key={"newFile" + index}>
                          <span className="filename">{item}</span>
                        </p>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="expert-frm-bottom">
        {/* react editor 사용 */}
        <TextEditor
          data={expertIntro}
          setData={setExpertIntro}
          url={backServer + "/product/editor"}
        />
      </div>
      <div className="expert-frm-btn-box">
        <Button1
          text={type === "modify" ? "수정하기" : "작성하기"}
          clickEvent={buttonFunction}
        />
        <Button3 text="뒤로가기" clickEvent={buttonFunction} />
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const file = props.file;

  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;

  const deleteFile = () => {
    setDelFileNo([...delFileNo, file.expertFileNo]);
    const newFileList = fileList.filter((item) => {
      return item != file;
    });
    setFileList(newFileList);
  };

  return (
    <p>
      <span className="filename">{file.filename}</span>
      <span className="material-icons del-file-icon" onClick={deleteFile}>
        delete
      </span>
    </p>
  );
};
export default ExpertFrm;
