package kr.co.member.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.util.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="myBid")
@Schema(description = "내 입찰목록 객체")
public class MyBid {
	private int memberNo;
	private int currentStatus;
	private String filterStartDate;
	private String filterEndDate;
	private PageInfo pageInfo;  //페이징 정보

}
