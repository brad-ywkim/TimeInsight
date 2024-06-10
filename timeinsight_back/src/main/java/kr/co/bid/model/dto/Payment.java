package kr.co.bid.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="payment")
@Schema(description = "결제정보 객체")
public class Payment {
	private int paymentNo;
	private int bidNo;
	private int memberNo;
    private long tradeNo;
    private String productName;
    private int paymentAmount;
    private String paymentDate;
}
