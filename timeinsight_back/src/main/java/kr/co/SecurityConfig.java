package kr.co;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration //이 애노테이션은 해당 클래스가 스프링의 Java 기반 설정 클래스임을 나타냅니다. 즉, 이 클래스는 Bean을 정의하고 구성하는 데 사용됩니다.
@EnableWebSecurity  //springSecurity 활성화 ->이를 통해 Spring Security가 필터 체인을 등록하고 웹 요청을 처리하는 데 필요한 보안 구성을 할 수 있습니다.
public class SecurityConfig { 
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{ //필터체인 등록을 통해 스프링시큐리티 활성화 -> 보안 기능 요청, 적용 가능
		//스프링 시큐리티는 보안 필터 체인을 사용하여 웹 요청에 대한 보안 기능을 적용합니다. 이 필터 체인에는 여러 개의 필터가 포함되어 있으며, 각각의 필터는 특정한 보안 작업을 수행합니다. 예를 들어, 사용자의 인증 상태를 확인하는 인증 필터, 권한을 부여하는 권한 필터 등이 있습니다.
		return http
					.httpBasic(HttpBasicConfigurer::disable) 	//http 기본인증 사용안함 (최초 시큐리티 설치 시 나타나는 기본 로그인 창 안쓰겠다고 설정) -> java 더블콜론 문법
					.csrf(CsrfConfigurer::disable) 				//CSRF 기본설정 사용안함
					.cors(Customizer.withDefaults())			//CORS 기본설정 사용안함
					.sessionManagement(config ->  //더이상 세션인증을 사용하지 않음 -> 서버는 상태값을 갖지 않음(이걸 보고 stateless라고 한다.)
						config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  //사용자 로그인 여부와 무관하게 서버가 상태가 없다.
					.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) //모든 요청에 대해서 승인(추후 인터셉터에서 로그인 체크 처리)
					.build(); //보안설정 객체 사용
	}
}
/*
.httpBasic(HttpBasicConfigurer::disable): HTTP 기본 인증을 비활성화합니다. 따라서 사용자가 서버에 요청을 보낼 때 기본 로그인 창이 나타나지 않습니다.
.CSRF(Cross-Site Request Forgery) 보호를 비활성화합니다. 이는 웹 애플리케이션의 보안 취약점을 방지하기 위한 기능 중 하나입니다.
.CORS(Cross-Origin Resource Sharing)를 활성화합니다. 이는 웹 애플리케이션의 리소스가 다른 출처에서 요청될 때 교차 출처 요청을 처리하는 방법을 제어하는 기능입니다.
.sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS)): 세션 관리를 구성합니다. 여기서는 세션을 상태가 없는(stateless) 방식으로 구성하여 사용자의 로그인 상태와 무관하게 서버가 상태를 유지하지 않도록 합니다. 
 */