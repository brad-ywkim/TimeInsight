package kr.co.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.member.model.dto.Member;
import kr.co.member.model.dto.MyBid;

@Mapper
public interface MemberDao {

	Member selectOneMember(String memberId);  //로그인
	int insertMember(Member member);
	int updateInfo(Member member);
	int deleteMember(String memberId);
	int changePwMember(Member member);
	int selectMembmerNo(String memberId);
	int totalCount(MyBid myBid);
	List selectMyBidList(MyBid myBid);
	List<Member> selectMember();
	int totalMemberCount();
	int updateMemberGrade(Member member);
	int selectMemberGrade(int memberNo);

}
