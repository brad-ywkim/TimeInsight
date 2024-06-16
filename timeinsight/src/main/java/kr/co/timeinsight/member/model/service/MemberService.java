package kr.co.timeinsight.member.model.service;

import kr.co.timeinsight.member.model.dao.MemberDao;
import kr.co.timeinsight.member.model.dto.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    private MemberDao memberDao;
    public Member selectOneMember(String memberId) {
        return memberDao.selectOneMember(memberId);
    }



}
