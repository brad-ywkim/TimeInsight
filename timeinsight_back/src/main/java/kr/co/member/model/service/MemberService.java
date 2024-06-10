package kr.co.member.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.bid.model.dao.BidDao;
import kr.co.bid.model.dto.Payment;
import kr.co.member.model.dao.MemberDao;
import kr.co.member.model.dto.Member;
import kr.co.member.model.dto.MyBid;
import kr.co.util.JwtUtil;
import kr.co.util.PageInfo;
import kr.co.util.Pagination;

@Service
public class MemberService {

	@Autowired
	private MemberDao memberDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private JwtUtil jwtUtil;

	
	@Autowired
	private Pagination pagination;

	@Autowired
	private BidDao bidDao;
	
	
	public Member selectOneMember(String memberId) {
		return memberDao.selectOneMember(memberId);
	}

	@Transactional
	public int insertMember(Member member) {
		return memberDao.insertMember(member);
	}

	public String login(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId()); //회원정보 가져와 저장		
		if (m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			if(m.getMemberGrade() == 3) {
				String accessToken = "blackMember";
				return accessToken;
			}else {
				long expiredDateMs = 60 * 60 * 1000l; // 1시간 세팅 -> 밀리세컨즈 단위로 해야해서 1000을 곱해주고 l(알파벳 long)을 붙여줌
				String accessToken = jwtUtil.createToken(member.getMemberId(), expiredDateMs);
				return accessToken;				
			}
		} else {
			return null;
		}
	}

	@Transactional
	public int updateInfo(Member member) {
		return memberDao.updateInfo(member);
	}

	@Transactional
	public int deleteMember(String memberId) {

		return memberDao.deleteMember(memberId);
	}

	public int checkPw(Member member, String memberId) {
		// bycrypt 패스드워 검증 : 1. 아이디를 가지고 회원정보조회 -> 암호화된 패스워드와 평문 패스워드를 비교
		Member m = memberDao.selectOneMember(member.getMemberId());
		if (m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
		} else {
			return 0;
		}
	}

	@Transactional
	public int changePwMember(Member member) {
		return memberDao.changePwMember(member);

	}

	public int selectMemberNo(String memberId) {
		return memberDao.selectMembmerNo(memberId);
	}

	public Map selectMyBidList(MyBid myBid, int reqPage) {
		int numPerPage = 5; //한 페이지당 게시물 수
		int pageNaviSize = 5; //페이지 네비게이션 사이즈
		int totalCount = 0;
		Payment paymentInfo = null;
		if(myBid.getCurrentStatus() == 0) {
			myBid.setCurrentStatus(1);
			totalCount = memberDao.totalCount(myBid);	
		}else if(myBid.getCurrentStatus() == 1) {
			System.out.println("결제대기");
			myBid.setCurrentStatus(2);
			System.out.println("서비스:" + myBid);
			totalCount = memberDao.totalCount(myBid);
		}else {
			myBid.setCurrentStatus(3);

			totalCount = memberDao.totalCount(myBid);
		}
		
		System.out.println("토탈: " + totalCount);
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		myBid.setPageInfo(pi);
		System.out.println("check : " + myBid);
		List list = memberDao.selectMyBidList(myBid);
		System.out.println(list);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("myBidList", list);
		map.put("pi", pi);
		map.put("paymentInfo", paymentInfo);
		return map;
	}

	public Map selectMember(int reqPage) {
		int numPerPage = 5;
		int pageNaviSize = 5;
		int totalCount = memberDao.totalMemberCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<Member> member = memberDao.selectMember();
		map.put("memberList", member);
		map.put("pi", pi);
		return map; 
	}

	@Transactional
	public int updateMemberGrade(Member member) {
		return memberDao.updateMemberGrade(member);
	}

	
}
