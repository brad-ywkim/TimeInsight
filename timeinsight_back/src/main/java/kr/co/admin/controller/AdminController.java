package kr.co.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.ResponseDTO;
import kr.co.bid.model.dto.Bid;
import kr.co.bid.model.service.BidService;
import kr.co.member.model.dto.Member;
import kr.co.member.model.service.MemberService;
import kr.co.product.model.dto.Product;
import kr.co.product.model.service.ProductService;

@CrossOrigin("*")
@RequestMapping(value = "/admin")
@RestController // 비동기 responseBody 역할을 포함함
@Tag(name = "ADMIN", description = "ADMIN API")
public class AdminController {
	@Autowired
	private ProductService productService;

	@Autowired
	private MemberService memberService;
	
	@Autowired
	private BidService bidService;

	@GetMapping(value = "/expertList/{reqPage}")
	public ResponseEntity<ResponseDTO> selectExpert(@PathVariable int reqPage) {
		Map map = productService.selectExpertList(reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}

	@GetMapping(value = "/memberList/{reqPage}")
	public ResponseEntity<ResponseDTO> selectMember(@PathVariable int reqPage) {
		Map<String, Object> map = memberService.selectMember(reqPage);
		if (map != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@PatchMapping(value = "/updateMemberGrade")
	public ResponseEntity<ResponseDTO> updateMemberGrade(@RequestBody Member member) {
		int result = memberService.updateMemberGrade(member);
		if (result == 1) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}

	}

	@GetMapping(value = "/productList/{reqPage}")
	public ResponseEntity<ResponseDTO> selectAllProductList(@PathVariable int reqPage) {
		Map map = productService.selectAllProductList(reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());

	}
	
	
	@GetMapping(value="/memberBidHistory/{memberNo}")
	public ResponseEntity<ResponseDTO> selectMemberBidHistory(@PathVariable int memberNo){
		List<Bid> bidList = bidService.selectMemberBidHistory(memberNo);
		if (bidList != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", bidList);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		} else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@PatchMapping(value="/cancleProduct")
	public ResponseEntity<ResponseDTO> cancleProduct(@RequestBody Product product){
		int result = productService.cancleProduct(product);
		if(result >0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	
}
