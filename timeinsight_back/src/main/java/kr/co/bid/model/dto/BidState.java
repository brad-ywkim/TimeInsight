package kr.co.bid.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("bidState")
@Schema(description = "입찰 상태")
public class BidState {
	
	private int maxBidNo;
	private int productNo;
}
