package kr.co.timeinsight.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kr.co.timeinsight.member.model.dto.Member;
import kr.co.timeinsight.member.model.service.MemberService;
import kr.co.timeinsight.ResponseDTO;
import kr.co.util.EmailSender;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController //restFul API 의 컨트롤러임을 나타낸다.
@RequestMapping(value="/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private EmailSender emailSender;
    

    @Operation(summary = "아이디 중복 체크", description = "매개변수로 전달한 아이디의 사용여부")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
    @GetMapping(value="/id/{memberId}")
    public ResponseEntity<ResponseDTO> selectOneMember(@PathVariable String memberId) {
        System.out.println("memberId = " + memberId);
        Member member = memberService.selectOneMember(memberId);
        if (member == null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        }
    }


    @Operation(summary = "회원가입 인증코드 이메일 전송", description = "입력받은 이메일로 랜덤하게 생성된 인증코드 전송")
    @PostMapping(value="/emailAuth")
    @PostMapping(value="/emailAtuh")
    public ResponseEntity<ResonseDto> sendEmail(@RequestMapping Member member){
        String memberEmail = member.getMemberEmail();
        String authCode = emails
    }
    














}

