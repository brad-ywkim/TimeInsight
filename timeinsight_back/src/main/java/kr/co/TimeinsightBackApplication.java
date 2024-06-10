package kr.co;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})  // springsecurity 설정을 풀어줘야 한다 => exclude 세팅.
@EnableAspectJAutoProxy(proxyTargetClass = true)   // AspectJ 라이브러리
public class TimeinsightBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimeinsightBackApplication.class, args);
	}

}
