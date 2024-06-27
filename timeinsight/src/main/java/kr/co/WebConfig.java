package kr.co;

import kr.co.util.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor LoginInterceptor;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://192.168.34.145:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(LoginInterceptor)
                .addPathPatterns("/member/**", "/product/**", "/bid/**", "/admin/**") //로그인해야 접근 가능
                .excludePathPatterns("/member/login","/member/id/*","/member/join", "/product/list/*",
                        "/product/list/*/*/*", "/product/editor/*",
                        "/product/expert/*", "/product/file/*","/product/expert/insert",
                        "/product/detail/*", "/member/emailAuth"); //로그인안해도 접근가능
    }





}
