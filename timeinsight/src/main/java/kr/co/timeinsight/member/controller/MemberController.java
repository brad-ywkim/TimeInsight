package kr.co.timeinsight.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kr.co.timeinsight.member.model.dto.Member;
import kr.co.timeinsight.member.model.service.MemberService;
import kr.co.timeinsight.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

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

}
