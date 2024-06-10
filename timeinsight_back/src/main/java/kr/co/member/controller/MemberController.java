package kr.co.member.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.models.Response;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.ResponseDTO;
import kr.co.bid.model.service.BidService;
import kr.co.member.model.dto.Member;
import kr.co.member.model.dto.MyBid;
import kr.co.member.model.service.MemberService;
import kr.co.util.EmailSender;

@CrossOrigin("*")
@RequestMapping(value = "/member")
@RestController // 비동기 responseBody 역할을 포함함
@Tag(name = "MEMBER", description = "MEMBER API")
public class MemberController {
	@Autowired
	private MemberService memberService;

	@Autowired
	private BidService bidService;

	@Autowired
	private EmailSender emailSender;

	@Operation(summary = "아이디 중복체크", description = "매개변수로 전달한 아이디의 사용가능여부 조회") //메서드가 수행하는 작업의 요약과 설명 제공
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@GetMapping(value = "/id/{memberId}")
	public ResponseEntity<ResponseDTO> selectOneMember(@PathVariable String memberId) {
		Member member = memberService.selectOneMember(memberId);
		if (member == null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@Operation(summary = "인증 코드 이메일 전송", description = "입력받은 이메일로 랜덤하게 생성된 인증코드를 전송합니다.")
	@PostMapping(value = "/emailAuth")
	public ResponseEntity<ResponseDTO> sendEmail(@RequestBody Member member) {
		String memberEmail = member.getMemberEmail();
		String authCode = emailSender.sendCode(memberEmail);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", authCode);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	
	@Operation(summary = "회원가입", description = "매개변수로 전달한 회원정보를 기반으로 새로운 회원을 등록")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@PostMapping(value = "/join")
	public ResponseEntity<ResponseDTO> join(@RequestBody Member member) {
		int result = memberService.insertMember(member);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	
	@Operation(summary = "로그인", description = "입력한 아이디 및 패스워드를 통해 아이디 및 패워스워 일치 여부 조회")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@PostMapping(value = "/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody Member member) {
		String accessToken = memberService.login(member);
		if (accessToken != null) {
			if (accessToken.equals("blackMember")) {
				// 블랙 멤버인 경우
				ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "blackMember", null);
				return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			} else {
				// 일반적인 로그인 성공
				ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", accessToken);
				return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
			}
		} else {
			// 로그인 실패
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "관리자 여부 확인", description = "로그인 한 회원의 회원등급을 조회하여 Header 탭 내 관리자 메뉴 노출 결정")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@GetMapping
	public ResponseEntity<ResponseDTO> getMember(@RequestAttribute String memberId) {
		Member member = memberService.selectOneMember(memberId);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	
	@Operation(summary = "비밀번호 일치여부 검증", description = "회원으로부터 입력받은 비밀번호를 암호화하여 기 암호화된 비밀번호와 동일한 지 확인")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@PostMapping(value = "/pw")
	public ResponseEntity<ResponseDTO> checkPw(@RequestBody Member member, @RequestAttribute String memberId) {
		member.setMemberId(memberId);
		int result = memberService.checkPw(member, memberId);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "valid", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "invalid", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	
	@Operation(summary = "비밀번호 변경", description = "입력받은 새 비밀번호로 기존 비밀번호를 업데이트")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "message 값 확인")})
	@PatchMapping(value = "/pw")
	public ResponseEntity<ResponseDTO> changePw(@RequestBody Member member, @RequestAttribute String memberId) {
		member.setMemberId(memberId);
		int result = memberService.changePwMember(member);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	 
	
	@Operation(summary = "회원 정보 수정", description = "수정할 전화번호, 이메일 정보를 받아 회원정보를 수정")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러" )})
	@PatchMapping(value = "/updateInfo")
	public ResponseEntity<ResponseDTO> updateInfo(@RequestBody Member member) {
		System.out.println("멤버 정보 : " + member);
		int result = memberService.updateInfo(member);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}

	@Operation(summary = "회원탈퇴", description = "탈퇴 회원의 정보를 모두 삭제")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@DeleteMapping
	public ResponseEntity<ResponseDTO> deleteMember(@RequestAttribute String memberId) {
		int result = memberService.deleteMember(memberId);
		if (result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}


	@Operation(summary = "입찰내역 확인", description = "회원의 전체 입찰 참여 내역을 확인")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@GetMapping(value = "/bidHistory/{currentStatus}/{reqPage}/{filterStartDate}/{filterEndDate}")
	public ResponseEntity<ResponseDTO> selectMyBid(@RequestAttribute String memberId, @PathVariable int currentStatus,
			@PathVariable String filterStartDate, @PathVariable String filterEndDate, @PathVariable int reqPage) {
		System.out.println("상태값: " + currentStatus);
		int memberNo = memberService.selectMemberNo(memberId);
		MyBid myBid = new MyBid(memberNo, currentStatus, filterStartDate, filterEndDate, null);
		Map map = memberService.selectMyBidList(myBid, reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
}
