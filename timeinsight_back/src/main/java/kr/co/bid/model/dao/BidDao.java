package kr.co.bid.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.bid.model.dto.Bid;
import kr.co.bid.model.dto.BidState;
import kr.co.bid.model.dto.Payment;
import kr.co.member.model.dto.MyBid;
import kr.co.product.model.dto.Product;

@Mapper
public interface BidDao {
	int insertBid(Bid bid);
	Integer selectBidState(int productNo, int memberNo);
	Bid selectBid(int productNo, int memberNo);
	int selectBidNo(int productNo, int memberNo);
	int cancleBid(int bidNo);
	int updateReBid(int bidNo, int i);
	int updateBidAmount(Bid bid);
	List<Integer> selectBidList(List<Integer> endList);
	int selectBidCount(Integer integer);
	int selectMaxBidNo(Integer integer);
	int updateBidStateTwo(BidState bs);
	int updateBidStateThree(BidState bs);
	int insertPayment(Payment payment);
	int updateBidSuccess(int bidNo);
	Payment selectPaymentInfo(int bidNo);
	List<Integer> selectNonPayList();
	int updateBidStateFive(Integer integer);
	int selectOneBidCount(Product product);
	List<Bid> selectMemberBidHistory(int memberNo);
	Product selectRealTimeBid(int productNo);



}
