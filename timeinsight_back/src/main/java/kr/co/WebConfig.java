package kr.co;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.co.util.LoginInterceptor;


@Configuration
public class WebConfig implements WebMvcConfigurer{

	@Autowired
	private LoginInterceptor LoginInterceptor;
	

	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(LoginInterceptor)
				.addPathPatterns("/member/**", "/product/**", "/bid/**",  "/admin/**") //로그인 해야 접근가능
				.excludePathPatterns("/member/login","/member/id/*","/member/join", "/product/list/*",
						"/product/list/*/*/*", "/product/editor/*", 
						"/product/expert/*", "/product/file/*","/product/expert/insert",
						"/product/detail/*", "/member/emailAuth"); //로그인안해도 접근가능
	}
	
	
	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/product/editor/**")
		.addResourceLocations("file:///C:/Temp/timeinsight/expertEditor/");
		registry.addResourceHandler("/product/expert/**")
		.addResourceLocations("file:///C:/Temp/timeinsight/expert/");
	}
	
    
        
	
	//Controller마다 CrossOrigin("*")설정을 안해도 됨
	//프로젝트 전체에 한 번에 적용하는 것이다. => rest 서버를 사용하려면 본 작업을 진행해야 한다.
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
	}
    


}
