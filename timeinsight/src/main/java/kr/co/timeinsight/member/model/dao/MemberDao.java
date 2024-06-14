package kr.co.timeinsight.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.timeinsight.member.model.dto.Member;


@Mapper
public interface MemberDao {

    Member selectOneMember(String memberId);  //로그인
    int insertMember(Member member);
    int updateInfo(Member member);
    int deleteMember(String memberId);
    int changePwMember(Member member);
    int selectMembmerNo(String memberId);

    List<Member> selectMember();
    int totalMemberCount();
    int updateMemberGrade(Member member);
    int selectMemberGrade(int memberNo);

}
