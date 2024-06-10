import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <ul>
          <li>
            <Link to="#">이용약관</Link>
          </li>
          <li>
            <Link to="#">개인정보취급</Link>
          </li>
          <li>
            <Link to="#">인재채용</Link>
          </li>
          <li>
            <Link to="#">제휴문의</Link>
          </li>
        </ul>
        <p>무단 복제를 금지합니다.</p>
      </div>
    </footer>
  );
};

export default Footer;
