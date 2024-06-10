package kr.co.util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor{
	//Controller 가기 전에 token값으로 아이디를 추출해서 사용할 수 있도록 등록

	@Autowired
	private JwtUtil jwtUtil; //인증만료시간 여부를 확인하기 위함(true면 인증시간 만료)
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		//로그인을 성공한 이후 요청이 들어오면 header에서 인증 토큰을 꺼냄
		String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
		System.out.println("헤더에서 꺼낸 정보 : " + auth);  //Bearer 토큰값
		//1. 인증토큰이 없거나 잘못된 값을 보낸 경우
		if(auth == null || auth.indexOf("null") != -1 || !auth.startsWith("Bearer ")) {
			System.out.println("인증이 없거나 잘못된 경우");
			return false; //인증이 없거나 잘못된 경우이므로 이후 컨트롤러 실행 안함
		}
		//인증코드 값은 형식에 맞는 상태
		//2.인증시간이 만료되었는 지 체크 (jwtUtil.java를 통해서 진행)
		String token = auth.split(" ")[1]; //split: 특정문자로 잘라서 배열로 줌 -> 토큰값만 분리해서 가져옴 
		if(jwtUtil.isExpired(token)){
			System.out.println("인증시간 만료된 경우");
			return false;
		}
		
		//1,2 과정 통과 -> 인증정보 정상 && 만료되기 전 상태 -> 정상 요청
		//-> 이후 컨트롤러에서 로그인한 회원 아이디를 사용할 수 있도록 아이디를 추출해서 등록
		String memberId = jwtUtil.getMemberId(token);
		//요청들어가는 거에 넣어줌
		request.setAttribute("memberId", memberId);
		return true;
	}
	
	
}
