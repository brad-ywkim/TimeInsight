package kr.co.product.model.service;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.bid.model.dao.BidDao;
import kr.co.bid.model.dto.Bid;
import kr.co.bid.model.dto.BidState;
import kr.co.bid.model.service.RealTimeBidHanlder;
import kr.co.product.model.dao.ProductDao;
import kr.co.product.model.dto.Expert;
import kr.co.product.model.dto.ExpertFile;
import kr.co.product.model.dto.Product;
import kr.co.product.model.dto.ProductFilter;
import kr.co.util.Pagination;
import kr.co.util.PageInfo;

@Service
public class ProductService {
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private BidDao bidDao;
	
	@Autowired
	private Pagination pagination;
	@Autowired
	private RealTimeBidHanlder allSuccessBidHandler;
	
	public Map selectProductList(String selectedCategory, int reqPage, int filter) {
		int numPerPage = 12; //한 페이지 당 게시물 수
		int pageNaviSize = 5; //페이지 네비게이션 사이즈
		int totalCount = productDao.totalCount(selectedCategory); //전체 전문가 수 (전체 페이지 수 계산을 위함)
		
		//페이징 처리에 필요한 값을 계산해서 객체로 리턴 받음
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
	
		ProductFilter pf = new ProductFilter();
		pf.setPageInfo(pi);
		pf.setSelectedCategory(selectedCategory);
		pf.setFilter(filter);
		List list = productDao.selectProductList(pf);
		
		int totalTime = productDao.selectTotalTime(selectedCategory);
		HashMap<String, Object> map =  new HashMap<String, Object>();
		map.put("productList", list);
		map.put("totalTime", totalTime);
		map.put("pi", pi);
	
		return map;	
	}
	

	public Map selectExpertList(int reqPage) {
		//한 페이지당 노출 게시물 수
		//페이지 시작 게시물 번호
		//페이지 끝 게시물 번호
		//총 게시물 수
		//전체 페이지 수
		//네비게이션 사이즈
		//페이지 네비게이션 시작 번호
		int numPerPage = 5; //한 페이지 당 게시물 수
		int pageNaviSize = 5; //페이지 네비게이션 사이즈
		int totalExpertCount = productDao.totalExpertCount(); //전체 전문가 수 (전체 페이지 수 계산을 위함)
		System.out.println("총 전문가 수 : " + totalExpertCount);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalExpertCount);
		List list = productDao.selectExpertList(pi);
		System.out.println("전문가 : " + list);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("expertList", list);
		map.put("pi", pi);
		return map;

	}

	@Transactional
	public int insertExpert(Expert expert, ArrayList<ExpertFile> fileList) {
		int result = productDao.insertExpert(expert); //selectKey로 expertNo롤 가져와 넣는다.		
		for(ExpertFile ef : fileList) {
			ef.setExpertNo(expert.getExpertNo());
			result += productDao.insertExpertFile(ef);
		}
		
		return result;
	}

	public Expert selectOneExpert(int expertNo) {
		Expert expert = productDao.selectOneExpert(expertNo);
		List list = productDao.selectOneExpertFileList(expertNo);
		expert.setFileList(list);
		return expert;
	}

	public ExpertFile selectOneExpertFile(int expertFileNo) {
		return productDao.selectOneExpertFile(expertFileNo);
	}

	@Transactional
	public List<ExpertFile> updateExpert(Expert expert, ArrayList<ExpertFile> fileList) {
		List<ExpertFile> delFileList = new ArrayList<ExpertFile>();
		int result = 0;
		int delFileCount = 0;
		
		//삭제한 파일이 있으면 파일정보 조회, DB정보 삭제
		if(expert.getDelFileNo() != null) {
			delFileCount = expert.getDelFileNo().length;
			//삭제 파일 리스트 정보  조회
			delFileList = productDao.selectExpertFile(expert.getDelFileNo());
			//삭제 파일 리스트 삭제
			result += productDao.deleteExpertFile(expert.getDelFileNo());
		}
		//추가한 파일 있으면 DB에 추가
		for(ExpertFile ef : fileList) {
			result += productDao.insertExpertFile(ef);
			
		}
		result += productDao.updateExpert(expert);
		if(result == 1+fileList.size()+delFileCount) {
			return delFileList;	
		}else {
			return null;	
		}
				
		
	}

	@Transactional
	public int insertProduct(Product product) {
		int result = productDao.insertProduct(product);
		return result;
	}

	
	public Product selecteOneProduct(int productNo) {
		Product product = productDao.selectProduct(productNo);
		return product;
	}
	
	
	public Product selecteProduct(int productNo, int memberNo) {
	    Product product = productDao.selectProduct(productNo);
	    Integer bidState = bidDao.selectBidState(productNo, memberNo); // Integer로 변경
	    if(bidState == null) {
	    	product.setBidState(0);
	    }else {
	    	Bid bid = bidDao.selectBid(productNo, memberNo);
	    	product.setBidState(bidState);
	    	product.setBidNo(bid.getBidNo());
	    	product.setBidAmount(bid.getBidAmount());
	    }
	    return product;
	}


	
	@Transactional
	public void productStateSchedule() {
		/*----------------------------------------------------------------------------------------*/
		//1. 판매중인 상품 중 입찰마감기한이 지난 상품들에 대해 마감 처리
		// 마감된 상품 && product_state=1 인 상품을 조회한다.
		List<Integer> endList = productDao.selectEndList();

		if (endList.size() > 0) {
			for (int i = 0; i < endList.size(); i++) {
				// 해당 상품의 입찰건수를 조회한다.
				int bidnum = bidDao.selectBidCount(endList.get(i));
				if (bidnum == 0) { // 입찰건수가 = 0 이면,
					int productStateFour = productDao.updateProductStateFour(endList.get(i));
				
				} else {
					// 입찰개수가 있다면, product_state를 2로 변경하고, 최고입찰가는 bid_state를 2, 나머지는 bid_State 3으로 업데이트
					int productStateTwo = productDao.updateProductStateTwo(endList.get(i));
					int maxBidNo = bidDao.selectMaxBidNo(endList.get(i));
					BidState bs = new BidState();
					bs.setMaxBidNo(maxBidNo);
					bs.setProductNo(endList.get(i));
					
					int updateBidStateTwo = bidDao.updateBidStateTwo(bs); // 최고가 업데이트(객체전달)
					int updateBidStateThree = bidDao.updateBidStateThree(bs); // 패찰 업데이트(객체전달)
				}
			}
		}
		
		//2. 낙찰자의 마감기한이 종료된 상품 조회 후 미납부 시, 미납에 따른 상태 종료
		List<Integer> nonPayList = bidDao.selectNonPayList();
		if(nonPayList.size() > 0) {
			for (int i = 0; i<nonPayList.size(); i++) {
				int bidStateFive = bidDao.updateBidStateFive(nonPayList.get(i));
				int productNo = productDao.selectProductNo(nonPayList.get(i));
				int updateProductStateFive = productDao.updateProductStateFive(productNo);
				System.out.println("입찰상태 미납부 변경 : " + bidStateFive);
				System.out.println("상품상태 미납부 변경" + updateProductStateFive );
				
			}
		}

		
	}

	
	public Map selectAllProductList(int reqPage) {
		int numPerPage = 5;
		int pageNaviSize = 5;
		int totalCount = productDao.totalProductCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<Product> product = productDao.selectAllProduct();
        
		map.put("productList", product);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int updateProduct(Product product) {
		int result = productDao.updateProduct(product);
		return result;
	}

	@Transactional
	public int cancleProduct(Product product) {
		int result = 0;
		int bidCount = bidDao.selectOneBidCount(product);
		if(bidCount == 0) {
			result = productDao.cancleProduct(product);
		}else {
			result = 0;
		}
		return result;
	}
	
	
	
	
	

}
