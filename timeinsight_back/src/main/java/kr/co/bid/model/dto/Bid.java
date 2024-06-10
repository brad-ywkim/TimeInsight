package kr.co.bid.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "bid")
@Schema(description = "입찰 객체")
public class Bid {
	private int bidNo;
	private int productNo;
	private int memberNo;
	private int bidAmount;
	private String bidDate;
	private String bidState;
	private String paymentDueDate;

	// 신규
	private String expertName;
	private String expertThumbnail;
	private String productName;
	private String endDate;
	private String memberName;
	private String memberEmail;
	private String memberPhone;
	private String zipcode;
	private String address;
	private String addressDetail;

}
