package kr.co.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;



@Component
public class LoginInterceptor implements HandlerInterceptor {
    //컨트롤러 가기전에 token값으로 아이디를 추출해서 사용할 수 있도록 등록


    @Autowired
    private JwtUtil jwtUtil;


    //상속이란 상위 클래스의 변수, 메소드 등을 가져와 사용할 수 있다는 개념이다.
    //상속받은 여러 메소드 중 마음에 들지 않는 메소드가 있다면, Override를 통해 재정의해서 커스터마이징이 가능하다.
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //로그인을 성공한 이후 요청이 들어오면 header에서 인증 토큰을 꺼낸다.
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("header에서 꺼낸 정보: "+ auth);

        //1. 인증토큰이 없거나 잘못된 값을 보낸 경우
        if(auth == null || auth.indexOf("null") != -1 || !auth.startsWith("Bearer ")){
            System.out.println("인증이 없거나 잘못된 경우");
            return false;
        }

        //2. 인증시간이 만료되었는 지 체크 (jwtUtil.java 를 통해서 진행)
        String token  = auth.split(" ")[1];
        if(jwtUtil.isExpired(token)){
            System.out.println("인증시간 만료");
            return false;
        }

        //3. 인증정보 정상 & 만료 전 상태 -> 정상 요청
        String memberId = jwtUtil.getMemberId(token);
        request.setAttribute("memberId", memberId);
        return true;
    }
}
