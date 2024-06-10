package kr.co.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
//스웨거 작성 필요 없음
//페이징 계산을 위해 필요한 것들을 모두 작성
		//한 페이지당 노출 게시물 수 : numPerPage
		//페이지 시작 게시물 번호  ->게시물 조회할 때 범위 지정시 사용 : start
		//페이지 끝 게시물 번호 -> 게시물 조회할 때 범위 지정시 사용 : end
		//총 게시물 수 : totalCount
		//전체 페이지 수 : totalPage
		//네비게이션 사이즈  : pageNaviSize
		//페이지 네비게이션 시작 번호 : pageNo
public class PageInfo {
	private int start;
	private int end;
	private int pageNo; //페이지 네비게이션 시작번호
	private int pageNaviSize;
	private int totalPage;

	
	
}
