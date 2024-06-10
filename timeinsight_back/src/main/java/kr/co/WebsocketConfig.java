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
	
	@Override   //이걸 구현해야 함
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(allMemberSuccessBidHandler, "/allSuccessBid").setAllowedOrigins("*"); //어디서 들어오든 허용
			
	}
}
