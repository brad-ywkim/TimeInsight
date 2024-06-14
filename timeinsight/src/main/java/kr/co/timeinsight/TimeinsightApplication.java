package kr.co.timeinsight;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class TimeinsightApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimeinsightApplication.class, args);
	}


}
