package kr.co.bid.model.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.product.model.dto.Product;

//TextWebSocketHandler 상속
@Component
public class RealTimeBidHanlder extends TextWebSocketHandler{ 
    private final List<WebSocketSession> sessions = new ArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();


	
	//클라이언트가 웹소켓에 접속하면 호출되는 메소드 : 최초에 접속하면 인식하는 메소드 (Ex: 채팅방 접속시 호출)
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("클라이언트 접속!");
        sessions.add(session);
	}
	
	//
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("클라이언트가 뭔가보냄");
	}

	
	//클라이언트가 접속을 끊으면 자동으로 호출되는 메소드 (Ex: 채팅방 퇴장시 호출)
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("클라이언트 퇴장!");
        sessions.remove(session);
	}

	public void sendRealTimeBid(Product p) {		
			try {
				String realTimeBid= objectMapper.writeValueAsString(p);
				TextMessage message = new TextMessage(realTimeBid);
				for (WebSocketSession session : sessions) {
				session.sendMessage(message);
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
		}
	} 

