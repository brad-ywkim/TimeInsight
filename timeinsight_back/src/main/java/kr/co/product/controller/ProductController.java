package kr.co.product.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.ResponseDTO;
import kr.co.member.model.service.MemberService;
import kr.co.product.model.dto.Expert;
import kr.co.product.model.dto.ExpertFile;
import kr.co.product.model.dto.Product;
import kr.co.product.model.service.ProductService;
import kr.co.util.FileUtils;

@CrossOrigin("*")
@RequestMapping(value="/product")
@RestController //비동기 responseBody 역할을 포함함 
@Tag(name="PRODUCT", description = "PRODUCT API")
public class ProductController {
	
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private ProductService productService;

	@Autowired
	private FileUtils fileUtils;
	
	@Value("${file.root}")
	private String root;
	
	
	@Operation(summary = "상품 목록 조회", description = "전달받은 카테고리, 페이지, 필터 값을 기준으로 상품 목록을 조회")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@GetMapping(value="/list/{selectedCategory}/{reqPage}/{filter}")
	public ResponseEntity<ResponseDTO> selectProductList(@PathVariable String selectedCategory, @PathVariable int reqPage, @PathVariable int filter){
		Map map = productService.selectProductList(selectedCategory, reqPage, filter);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}	
		
	
	@Operation(summary = "ReactQuill 텍스트 에티더 활용", description = "Quill 에디터를 통해 입력한 데이터를 처리")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@PostMapping(value="/editor")
	public ResponseEntity<ResponseDTO> editorUpload(@ModelAttribute MultipartFile image){
		//multipartFile 형태로 들어오면 modelAttribute로 받는다. (pathvariable, requestbody가 아님)
		String savepath = root + "/expertEditor/"; 
		//String filename = image.getOriginalFilename(); //에디터에 들어갈 이미지는 db에 저장안함
		String filepath = fileUtils.upload(savepath, image);
		String returnPath = "/product/editor/" + filepath;
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", returnPath);
		return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
	}
	
	

	@Operation(summary = "전문가 등록", description = "입력받은 전문가 정보를 바탕으로 신규 전문가를 등록")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@PostMapping(value="/expert")
	public ResponseEntity<ResponseDTO> insertExpert(@RequestAttribute String memberId,
			@ModelAttribute Expert expert, @ModelAttribute MultipartFile thumbnail,
			@ModelAttribute MultipartFile[] expertFile){
		int memberNo = memberService.selectMemberNo(memberId);
		expert.setExpertWriter(memberNo);
		
		//썸네일
		String savepath = root+"/expert/";
		String filepath_thumbanail = fileUtils.upload(savepath, thumbnail);
		expert.setExpertThumbnail(filepath_thumbanail);
		

		//첨부파일
		ArrayList<ExpertFile> fileList = new ArrayList<ExpertFile>();
		for(MultipartFile file : expertFile) {
			String filename = file.getOriginalFilename();			
			String filepath = fileUtils.upload(savepath, file);
			ExpertFile ef = new ExpertFile();
			ef.setFilename(filename);
			ef.setFilepath(filepath);
			fileList.add(ef);
		}
		
		int result = productService.insertExpert(expert, fileList);
		
		
		if(result == 1+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	

	@Operation(summary = "전문가 상세조회", description = "관리자가 선택한 개별 전문가의 정보를 상세 조회")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "message 값 확인"), @ApiResponse(responseCode = "500", description = "서버 에러")})
	@GetMapping(value="/expertDetail/{expertNo}")
	public ResponseEntity<ResponseDTO> selectOneExpert(@PathVariable int expertNo){
		Expert expert = productService.selectOneExpert(expertNo);
		if(expert != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", expert);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	
	
	@GetMapping(value="/file/{expertFileNo}")
	public ResponseEntity<Resource> fileDown(@PathVariable int expertFileNo) throws FileNotFoundException{
		ExpertFile expertFile = productService.selectOneExpertFile(expertFileNo);
		String savepath = root+"/expert/";
//		/Temp/timeinsight/product
		File file = new File(savepath+expertFile.getFilepath());
		Resource resource = new InputStreamResource(new FileInputStream(file));
		//파일 다운로드 헤더 설정
		HttpHeaders header = new HttpHeaders();
		header.add("Content-Disposition", "attachment; filename=\""+expertFile.getFilename()+"\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma",  "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.headers(header)
				.contentLength(file.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
	}

	
	@PatchMapping(value="/expert")
	public ResponseEntity<ResponseDTO> updateExpert(@ModelAttribute Expert expert, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] expertFile){
		//기존 썸네일=expert.expertThumbnail, 신규 썸네일=thumbnail, 첨부파일=expertFile
		String savepath = root+"/expert/";
		if(expert.getThumbnailCheck() == 1) { //썸네일 변경된 경우
			if(thumbnail != null) { //새로 첨부한 경우
				String filepath = fileUtils.upload(savepath, thumbnail);
				//다운로드 안받을 것이므로, filename(원본명)을 getOringFilename안해도 됨
				expert.setExpertThumbnail(filepath);			
		}else {
			expert.setExpertThumbnail(null);
		}
		}
		//첨부파일 작업 (추가)
		ArrayList<ExpertFile> fileList = new ArrayList<ExpertFile>();
		if(expertFile != null) {
			for(MultipartFile file : expertFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				ExpertFile ef = new ExpertFile();
				ef.setFilename(filename);
				ef.setFilepath(filepath);
				ef.setExpertNo(expert.getExpertNo());
				fileList.add(ef);
			}
		}
		
		//첨부파일 (삭제)
		List<ExpertFile> delFileList = productService.updateExpert(expert,fileList);
		if(delFileList != null) {
			for(ExpertFile ef : delFileList) {
				File file = new File(savepath+ef.getFilepath()); //실제 경로의 파일을 생성해서 삭제
				
				file.delete();
			}
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
		}
	
		
	@PostMapping
	public ResponseEntity<ResponseDTO> insertProduct(@RequestAttribute String memberId, @RequestBody Product product ){
		
		
		int memberNo = memberService.selectMemberNo(memberId);
		product.setProductWriter(memberNo);
		int result = productService.insertProduct(product);
		
		if(result >0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@GetMapping(value="/detail/{productNo}")
	public ResponseEntity<ResponseDTO> selectOneProduct(@PathVariable int productNo){
		
		Product product = productService.selecteOneProduct(productNo);
		if(product != null) {
			//ResponseEntity는 Spring의 HTTP 메시지를 나타내는 클래스로 HTTP헤더, 상태코드, 바디를 포함.
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
		  ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
		  return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@GetMapping(value="/detail/{productNo}/{memberNo}")
	public ResponseEntity<ResponseDTO> selectProduct(@PathVariable int productNo, @PathVariable int memberNo){
		Product product = productService.selecteProduct(productNo, memberNo);
		if(product != null) {
			//ResponseEntity는 Spring의 HTTP 메시지를 나타내는 클래스로 HTTP헤더, 상태코드, 바디를 포함.
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", product);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
		  ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
		  return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	
	@PatchMapping(value="/updateProduct")
	public ResponseEntity<ResponseDTO> updateProduct(@RequestBody Product product){
		int result = productService.updateProduct(product);
		if(result >0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
	
	


}	
	