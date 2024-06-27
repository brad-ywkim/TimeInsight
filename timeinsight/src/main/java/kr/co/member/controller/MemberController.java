package kr.co.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.ResponseDTO;
import kr.co.member.model.service.MemberService;
import kr.co.member.model.dto.Member;
import kr.co.util.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin("*") // 필요한 도메인을 명시적으로 추가
@RequestMapping(value = "/member")
@RestController // 비동기 responseBody 역할을 포함함
@Tag(name = "MEMBER", description = "MEMBER API")
public class MemberController {
    @Autowired
    private MemberService memberService;



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
    @ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
    @PostMapping(value = "/emailAuth")
    public ResponseEntity<ResponseDTO> sendEmail(@RequestBody Member member) {
        String memberEmail = member.getMemberEmail();
        String authCode = emailSender.sendCode(memberEmail);
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", authCode);
        return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
    }

    @Operation(summary = "회원가입", description = "매개변수로 전달한 회원정보를 기반으로 새로운 회원을 등록")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
    @PostMapping(value="/join")
    public ResponseEntity<ResponseDTO> join(@RequestBody Member member){
        int result = memberService.insertMember(member);
        if (result > 0){
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        }else{
            ResponseDTO response = new ResponseDTO(500, HttpStatus.OK, "fail", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        }
    }


    @Operation(summary = "로그인", description = "입력한 아이디 및 패스워드를 통해 아이디 및 패스워드 일치 여부 조회")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
    @PostMapping(value="/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody Member member){
        String accessToken = memberService.login(member);
         if(accessToken != null) {
             if(accessToken.equals("blackMember")){
                 //블랙멤버인 경우
                 ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "blackMember", null);
                 return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
             }else {
                 //일반 사용자 로그인
                 ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", accessToken);
                 return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

             }
         }else{
             //로그인 실패
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
         }
    }



    @Operation(summary = )








}

