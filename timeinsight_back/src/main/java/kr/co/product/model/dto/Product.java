package kr.co.product.model.dto;



import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.bid.model.dto.Bid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="product")
@Schema(description = "상품 객체")
public class Product {
	@Schema(description = "상품번호", type = "number")
	private int productNo;
	private int productWriter;
	private int expertNo;
	private int categoryNo;
	private String productName;
	private String productDate;
	private int productTime;
	private String productPlace;
	private int totalParticipants;
	private int readCount;
	private String startDate;
	private String endDate;
	private int StartingPrice;
	private String productState;
	
	//추가
	private String expertName;
	private String categoryName;
	private String expertThumbnail;
	private String expertIntro;
	private String expertJob;
	private int memberNo;
	private int bidState;
	private int bidNo;
	private int bidAmount;
	private int bidCount;
    private String timestamp; // 현재 시간 필드 추가

}
