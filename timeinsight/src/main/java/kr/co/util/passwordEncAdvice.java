package kr.co.util;

import kr.co.member.model.dto.Member;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class passwordEncAdvice {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    //특정 메소드 실행 전 요청을 가로채서 암호화한다.
    //이 클래스는 비밀번호 암호화와 관련된 조언(Advice)을 제공합니다.
    //예를 들어, 사용자가 비밀번호를 변경하거나 새 계정을 만들 때,
    // 비밀번호를 자동으로 암호화하는 로직을 AOP를 사용하여 구현할 수 있습니다.


    //AOP란?
    //관점지향 프로그래밍
    //execution은 Spring AOP에서 포인트컷(Pointcut)을 정의하기 위해 사용되는 표현식입니다.
    //포인트컷은 특정 메서드 실행 지점을 가리키며, AOP 어드바이스(Advice)가 적용될 위치를 결정합니다.
    //execution 표현식은 메서드의 시그니처(메서드의 반환 타입, 이름, 매개변수 등)를 기반으로 포인트컷을 정의

    @Pointcut(value="execution (int kr.co.member.model.service.MemberService.*Member(kr.co.member.dto.Member))")
    public void pwEncPointcut() {}

    @Before(value="pwEncPointcut()")
    public void pwEncAdvice(JoinPoint jp){
        Object[] args = jp.getArgs(); //Advice가 적용된 메서드의 매개변수를 가져옴
        Member member  = (Member)args[0];
        String encPw = bCryptPasswordEncoder.encode(member.getMemberPw());
        member.setMemberPw(encPw);
    }
}
