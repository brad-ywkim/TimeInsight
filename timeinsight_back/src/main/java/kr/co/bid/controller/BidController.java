package kr.co.bid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.ResponseDTO;
import kr.co.bid.model.dto.Bid;
import kr.co.bid.model.dto.Payment;
import kr.co.bid.model.service.BidService;
import kr.co.member.model.service.MemberService;

@CrossOrigin("*")
@RequestMapping(value="/bid")
@RestController //비동기 responseBody 역할을 포함함 
@Tag(name="BID", description = "BID API")
public class BidController {
	
	@Autowired
	private BidService bidService;

	@Autowired
	private MemberService memberService;
	
	
	
	@PostMapping
	public ResponseEntity<ResponseDTO> insertBid(@RequestAttribute String memberId, @RequestBody Bid bid){
            int memberNo = memberService.selectMemberNo(memberId); // 오타 수정: selectMemberNo
            bid.setMemberNo(memberNo);
            System.out.println("여기여기:" +bid);
            int result = bidService.insertBid(bid);
            
            if (result > 0) {
                ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
                return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
            } else {
                ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
                return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
            }
        }

	
	@PatchMapping(value="/cancle")
	public ResponseEntity<ResponseDTO> cancleBid(@RequestBody Bid bid){
		int bidNo = bid.getBidNo();
		int result = bidService.cancleBid(bidNo);
		if (result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        }
	}
	
	
	
	@PatchMapping(value="/update")
	public ResponseEntity<ResponseDTO> updateBidAmount(@RequestBody Bid bid){
		int result = bidService.updateBidAmount(bid);
		if (result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
        }
		
	}
	
	@PostMapping(value="/payment")
	public ResponseEntity<ResponseDTO> insertPayment(@RequestBody Payment payment){
		System.out.println("결제 : " + payment);
		int result = bidService.insertPayment(payment);
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@PatchMapping(value="/bidSuccess")
	public ResponseEntity<ResponseDTO> updateBidSuccess(@RequestBody Bid bid){
		System.out.println(bid);
		int result = bidService.updateBidSuccess(bid.getBidNo());
		if(result > 0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	@GetMapping("{bidNo}")
	public ResponseEntity<ResponseDTO> selectBid(@PathVariable int bidNo){
		Payment payment = bidService.selectPaymentInfo(bidNo);
		if(payment != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", payment);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
}


	



