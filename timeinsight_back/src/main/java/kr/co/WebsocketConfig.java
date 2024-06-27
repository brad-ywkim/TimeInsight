package kr.co;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import kr.co.bid.model.service.RealTimeBidHanlder;

@Configuration
@EnableWebSocket
public class WebsocketConfig implements WebSocketConfigurer {

	@Autowired
	private RealTimeBidHanlder allMemberSuccessBidHandler;

	//클라리언트가 ws 엔드포인트로 websocket 요청
	//본 websocket config 클래스의 registerWebSocketHandlers 메소드를 사용하여 해당 요청을 처리할 핸들러를 결정 
	@Override  
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		//WebSocket요청이 aalSuccessBid로 들어오면, 핸들러로 맵핑
		registry.addHandler(allMemberSuccessBidHandler, "/allSuccessBid").setAllowedOrigins("*"); //어디서 들어오든 허용
		
	}
	
	
}
