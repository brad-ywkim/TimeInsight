package kr.co.member.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;



import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor  //매개변수 없는 생성자
@AllArgsConstructor //매개변수 있는 생성자
@Data   //getter, setter
@Alias("member")
@Schema(description = "회원 객체")
public class Member {
	
	@Schema(description = "회원번호", type = "number")
	private int memberNo; 
	@Schema(description = "아이디", type = "string")
	private String memberId;
	@Schema(description = "비밀번호", type = "string")
	private String memberPw;
	@Schema(description = "이름", type = "string")
	private String memberName;
	@Schema(description = "이메일", type="string")
	private String memberEmail;
	@Schema(description = "전화번호", type="string")
	private String memberPhone;
	@Schema(description = "회원등급", type="number")
	private int memberGrade;
	@Schema(description = "가입일", type="string")
	private String enrollDate;
	
	@Schema(description = "우편번호", type="string")
	private String zipcode;
	
	@Schema(description = "주소", type="string")
	private String address;
	
	@Schema(description = "상세주소", type="string")
	private String addressDetail;
	
	
//	@Schema(description = "약관동의", type="boolean")
//	private Boolean chkAgree;
//	@Schema(description = "취미", type="list")
//	private List<String> hobby;	
	
}
