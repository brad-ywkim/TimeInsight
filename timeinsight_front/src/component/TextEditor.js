import axios from "axios";
import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = (props) => {
  const { data, setData, url } = props;
  //컴포넌트 내부에서 특정 dom 객체를 선택할 때 사용하는 Hooks ->querySelector 대체
  const quillRef = useRef();
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
    "color",
  ];

  //이미지 ajax 비동기 업로드 관리하는 함수
  const imageHanlder = () => {
    //input 태그 생성
    const input = document.createElement("input");
    input.setAttribute("type", "file"); //파일업로드용이므로 파일 타입설정
    input.setAttribute("accept", "image/*"); //이미지 파일만 올릴 수 있도록 파일 제한
    input.click(); //생성한 input 클릭
    //생성한 input에 change 이벤트 적용
    input.onchange = async () => {
      //비동기요청->요청을 보낸다음 내 일을 한다.
      // 응답을 주고 응답을 받고 무언가를 해야하므로, 동기처리 해야함
      const files = input.files;
      if (files !== null) {
        const form = new FormData();
        form.append("image", files[0]);
        axios
          .post(url, form, {
            headers: {
              contentType: "multipart/formdata",
              processData: false, //thymeleaf에서 enctype 지정하는 것과 같다.
            },
          })
          .then((res) => {
            console.log(res);
            const editor = quillRef.current.getEditor(); //텍스트 에디터 dom을 선택(useRef)
            const range = editor.getSelection(); //에디터 내부 이미지 관리용
            const backServer = process.env.REACT_APP_BACK_SERVER;

            editor.insertEmbed(
              range.index,
              "image",
              backServer + res.data.data
            );
            editor.setSelection(range.index + 1);
          })
          .catch((res) => {
            console.log(res);
          });
      }
    };
  };

  //useMemo: 동일한 값을 반환하는 함수를 반복적으로 호출하는 것이 아니라, 메모리에 저장해두고 바로 가져오는 hooks
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
          ["image", "video"],
        ],
        handlers: {
          image: imageHanlder,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);
  return (
    <ReactQuill
      ref={quillRef}
      formats={formats}
      theme="snow"
      value={data}
      onChange={setData}
      modules={modules}
    />
  );
};

export default TextEditor;
