package kr.co.product.model.dto;

import kr.co.util.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductFilter {
	private String selectedCategory; //카테고리 정보
	private PageInfo pageInfo;  //페이징 정보
	private int filter;
}
