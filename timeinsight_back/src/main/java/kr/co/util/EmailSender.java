package kr.co.util;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailSender {

	@Autowired
	private JavaMailSender sender;

	public String sendCode(String memberEmail) {
		//이메일 메시지 구성
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message); //MimeMessage 객체 조작하여 최종적으로 message에 반영
		
		//랜덤 코드 생성
		Random r = new Random(); //랜덤 객체
		StringBuffer sb = new StringBuffer(); //StringBuffer는 문자열을 추가하거나 변경할 때 주로 사용하는 자료
		for (int i = 0; i < 5; i++) { 
			//각 자리 숫자마자 숫자, 대문자, 소문자 중 하나를 랜덤하게 선택
			int flag = r.nextInt(3); //random 객체를 사용하여 0~2 하나의 정수를 무작위 생성하여 flag 변수에 저장
			if (flag == 0) {
				int randomCode = r.nextInt(10); //0~9 랜덤 숫자 저장
				sb.append(randomCode);
			} else if (flag == 1) {
				char randomCode = (char) (r.nextInt(26) + 65); //대문자 무작위 저장
				sb.append(randomCode);
			} else if (flag == 2) {
				char randomCode = (char) (r.nextInt(26) + 97); //소문자 무작위 저장
				sb.append(randomCode);
			}
		}
		
		//이메일 메시지 전송
		try {
			helper.setSentDate(new Date());
			helper.setFrom(new InternetAddress("devlucian7@gmail.com", "Timeinsight"));
			helper.setTo(memberEmail);
			helper.setSubject("Timeinsight 이메일 인증");
			helper.setText("<h1>Timeinsight 이메일 인증 안내</h1>" + "<h3>인증번호는 [<span style='color:#4389BA;'>" + sb.toString()
					+ "</span>]입니다</h3>", true);
			sender.send(message);
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		}
		if (sb == null) {
			return null;
		} else {
			return sb.toString();
		}
	}

	public String sendId(String memberEmail, String memberId) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		StringBuffer sb = new StringBuffer();

		try {
			helper.setSentDate(new Date());
			helper.setFrom(new InternetAddress("devlucian7@gmail.com", "Timeinsight"));
			helper.setTo(memberEmail);
			helper.setSubject("Timeinsight 아이디 찾기");
			helper.setText("<h1>Timeinsight 아이디 찾기 안내</h1>" + "<h3>회원님의 아이디는 [<span style='color:#4389BA;'>" + memberId
					+ "</span>]입니다</h3>", true);
			sender.send(message);
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		}
		if (sb == null) {
			return null;
		} else {
			return sb.toString();
		}
		
	}
}