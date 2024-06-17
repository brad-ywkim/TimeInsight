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

    @Value("{jwt.secret}")
    public String secret;


    // JWT 토큰 생성
    public String createToken(String memberId, long expiredDateMs){
        Claims claims = Jwts.claims(); //클레임을 저장하고 관리하는 객체, 사용자 정보나 기타 데이터가 포함된다.
        claims.put("memberId", memberId); //회원 아이디 값 저장
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes()); //문자열을 바이트 배열[]로 변환하여 HMAC-SHA 알고리즘에 사용할 수 있는 SecretKey 객체로 변환
        return Jwts.builder() //Jwt 토큰 생성 시작
                .setClaims(claims) //아이디 정보세팅
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+expiredDateMs)) //인증 만료시간
                .signWith(key, SignatureAlgorithm.HS256) //암호화 키값 및 알고리즘
                .compact(); //위 내용들을 종합해서 jwt 토큰 생성
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
