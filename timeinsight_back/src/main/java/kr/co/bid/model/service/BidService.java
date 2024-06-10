package kr.co.bid.model.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.bid.model.dao.BidDao;
import kr.co.bid.model.dto.Bid;
import kr.co.bid.model.dto.Payment;
import kr.co.product.model.dao.ProductDao;
import kr.co.product.model.dto.Product;
import kr.co.product.model.service.ProductService;

@Service
public class BidService {
	@Autowired
	private BidDao bidDao;
	
	@Autowired
	private ProductDao productDao;

	@Autowired
	private RealTimeBidHanlder realTimeBidHandler;
	
	@Transactional
	public int insertBid(Bid bid)  {
		   	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		  	try {
	            // 문자열을 Date 객체로 변환
				Date endDate = sdf.parse(bid.getEndDate());
				
				 // Calendar를 사용해 Date 객체에 7일을 추가
	            Calendar calendar = Calendar.getInstance();
	            calendar.setTime(endDate);
	            calendar.add(Calendar.DAY_OF_MONTH, 7);
	            
	            // 날짜를 문자열로 다시 포맷
	            String newEndDate = sdf.format(calendar.getTime());
	            
	            // 결과 set
	            bid.setEndDate(newEndDate);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		  	

			Integer bidState = bidDao.selectBidState(bid.getProductNo(), bid.getMemberNo());
			int result = 0;
			if(bidState == null) {
				result = bidDao.insertBid(bid);
			}else if(bidState == 6){
				Bid b = bidDao.selectBid(bid.getProductNo(), bid.getMemberNo());
				//bidstate는 물로 입찰가격도 새로 등록해야함
				result = bidDao.updateReBid(b.getBidNo(), bid.getBidAmount());
			}
			
			//상품명, 전문가명, 입찰금액, 시간(현재시간)
	        LocalDateTime now = LocalDateTime.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	        String nowDateTime = now.format(formatter);

			
			Product p = new Product();
			p = bidDao.selectRealTimeBid(bid.getProductNo());
			p.setTimestamp(nowDateTime);
			p.setBidAmount(bid.getBidAmount());
			realTimeBidHandler.sendRealTimeBid(p);
			System.out.println("bid insert 테스트: " + result);
			return result;
	}

	@Transactional
	public int cancleBid(int bidNo) {
		int result = bidDao.cancleBid(bidNo);
		return result;
	}


	@Transactional
	public int updateBidAmount(Bid bid) {
		return bidDao.updateBidAmount(bid);
	}

	@Transactional
	public int insertPayment(Payment payment) {
		return bidDao.insertPayment(payment);
	}

	@Transactional
	public int updateBidSuccess(int bidNo) {
		int updateBidSucess = bidDao.updateBidSuccess(bidNo);
		int productNo =  productDao.selectProductNo(bidNo);
		updateBidSucess += productDao.updateProductStateThree(productNo);
		if(updateBidSucess == 2) {
			// 입찰 데이터가 삽입된 후 실시간으로 데이터를 전송합니다.
	        //입찰가격, 상품이름, 전문가명, 전문가썸네일
			return 1;	
		}else {
			return 0;
		}
	}

	public Payment selectPaymentInfo(int bidNo) {
		Payment payment = bidDao.selectPaymentInfo(bidNo);
		return payment;
	}

	public List<Bid> selectMemberBidHistory(int memberNo) {
		List<Bid> bidList = bidDao.selectMemberBidHistory(memberNo);
		return bidList;
	}

	
}