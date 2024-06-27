package kr.co.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.xml.crypto.Data;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}") //외부에 노출되면 안되서 본 방식으로 불러옴
    private String secret;
    //access token을 생성하는 메소드 (첫번째 매개변수는 토큰에다가 저장할 정보 -> 식별자, 두번째 매개변수 토큰인증 만료시간 long타입(밀리세컨즈))
    public String createToken(String memberId, long expiredDateMs) {
        //토큰에 넣을 식별자, 토큰의 유효시간 => 두개를 가지고 토큰을 만들어서 리턴할 것임.
        Claims claims = Jwts.claims(); //생성하는 토큰을 통해서 얻을 수 있는 값을 저장하는 객체 ->찍어주는 도장을 저장한다는 기능
        claims.put("memberId", memberId);//회원 아이디값을 저장  -> 찍어주는 도장이 커지면 무리가 가니, 필요한 정보인 memberId만 저장
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());//우리가 지정한 문자열을 이용해서 암호화 코드를 생성함.
        return Jwts.builder() //Jwt 토큰 생성 시작
                .setClaims(claims) //아이디 정보 세팅
                .setIssuedAt(new Date(System.currentTimeMillis()))//인증 시작 시간은 현재 시스템 시간
                .setExpiration(new Date(System.currentTimeMillis()+expiredDateMs))//인증만료시간
                .signWith(key, SignatureAlgorithm.HS256)//암호화할 때 사용할 키값 및 알고리즘
                .compact(); //위 내용들 종합해서 JWT 토큰 생성
    }

    // 매개변수로 토큰을 받아서 만료시간 체크
    public boolean isExpired(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
        //JWT 객체에 시크릿키(인증정보 정상인지 체크하는 용도), 토큰(사용자가 보내온 값), 현재시간이랑 비교해서 만료되었는 지
        return Jwts.parserBuilder()  //JWT(JSON Web Token)를 해석하고 검증하는 기능을 제공하는 도구 생성
                .setSigningKey(key).build()  //서명 키를 설정
                .parseClaimsJws(token) //이 메소드는 주어진 토큰을 파싱하고 서명검증
                .getBody() //페이로드(클레임) 추출
                .getExpiration() //만료 시간을 가져온다.
                .before(new Date()); //만료시간이 현재시간보다 이전인 지 체크
                //boolean 타입 리턴
    }

    // 회원 아이디 추출
    public String getMemberId(String token){
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        //JWT 파서 빌더를 사용하여 토큰을 파싱하고 서명을 검증하며 클레임을 추출
        return Jwts.parserBuilder() //JWT 를 해석하고 검증하는 기능을 제공하는 도구
                .setSigningKey(key).build() //서명 키 설정
                .parseClaimsJws(token) //토큰 파싱 및 검증
                .getBody() //페이로드 클레임 추출
                .get("memberId", String.class);
    }

    
}
