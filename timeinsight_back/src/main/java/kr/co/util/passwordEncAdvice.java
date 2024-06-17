package kr.co.util;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import kr.co.member.model.dto.Member;

@Aspect //aop 적용할 것으므로 어노테이션 세팅
@Component
public class passwordEncAdvice {

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	//중간에 전달되는 애를 가로채서(=특정메소드 실행 전) 암호화한다.
	//execution : 메서드 실행지점
	//int : 메서드 반환타입
	//해당 메서드 속한 클래스 패키지 경로
	//메서드 이름
	//메서드 매개변수 타입 지정
	@Pointcut(value="execution (int kr.co.member.model.service.MemberService.*Member(kr.co.member.model.dto.Member))")
	public void pwEncPointcut() {}
	
	@Before(value="pwEncPointcut()")
	public void pwEncAdvice(JoinPoint jp) { //advice
		Object[] args = jp.getArgs(); //Advice가 적용된 메서드의 매개변수들을 가져온다 (배열형태로 매개변수가 전달됨)
		Member member = (Member)args[0];
		String encPw  = bCryptPasswordEncoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
	}
}


