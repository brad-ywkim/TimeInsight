package kr.co.util;

import org.springframework.stereotype.Component;

@Component
public class Pagination {
	public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
		//현재 페이지, 페이지당 게시물 수, 페이지네비 사이즈, 총 개수
		int end = reqPage*numPerPage;
		int start = end-numPerPage+1;
		int totalPage = (int)Math.ceil(totalCount/(double)numPerPage); //java는 정수/정수=정수, 정수/실수=실수 -> 소수점이 붙고 올림처리해라.
		int pageNo = ((reqPage-1)/pageNaviSize) * pageNaviSize + 1;
		PageInfo pi = new PageInfo(start, end, pageNo, pageNaviSize, totalPage);
		return pi;
	}
}
