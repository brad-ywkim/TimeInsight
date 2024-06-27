import { useEffect, useState } from "react";
import "./realTimeBoard.css";

const RealTimeBoard = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://");

  const [ws, setWs] = useState(null); // 초기값을 null로 설정
  const [bid, setBid] = useState(() => {
    const savedBids = localStorage.getItem("bids");
    return savedBids ? JSON.parse(savedBids) : [];
  });

  useEffect(() => {
    const socket = new WebSocket(socketServer + "/allSuccessBid");

    // 웹소켓 연결이 완료되면 실행할 함수
    socket.onopen = () => {
      console.log("WebSocket connection established");
      // 필요시 메시지를 전송할 수 있습니다.
      // socket.send("갓냐");
    };

    // 서버에서 데이터를 받으면 실행되는 함수
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("서버 수신 데이터 : ", data);
      setBid((prevBids) => {
        const newBids = [...prevBids, data];
        localStorage.setItem("bids", JSON.stringify(newBids));
        return newBids;
      });
    };

    // 소켓 연결이 종료되면 실행할 함수
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // 소켓 오류가 발생하면 실행되는 함수
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(socket);

    return () => {
      console.log("페이지에서 나감");
      socket.close();
    };
  }, [socketServer]);
  console.log("실시간 입찰 현황: ", bid);
  return (
    <div className="realtimeboard__container">
      <h1 className="realtimeboard__title">Realtime Log</h1>
      <table className="realtimeboard__table">
        <thead>
          <tr>
            <th>입찰시간</th>
            <th>카테고리</th>
            <th colSpan={2}>전문가</th>
            <th>상품명</th>
            <th>입찰금액</th>
          </tr>
        </thead>
        <tbody>
          {bid.map((item, index) => (
            <tr key={index}>
              <td>{item.timestamp}</td>
              <td>{item.categoryName}</td>
              <td>
                {item.expertThumbnail === null ? (
                  <img src="/image/default2.png" />
                ) : (
                  <img
                    src={backServer + "/product/expert/" + item.expertThumbnail}
                  />
                )}
              </td>
              <td>{item.expertName}</td>
              <td>{item.productName}</td>
              <td>🔺{item.bidAmount.toLocaleString() + "원"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RealTimeBoard;
