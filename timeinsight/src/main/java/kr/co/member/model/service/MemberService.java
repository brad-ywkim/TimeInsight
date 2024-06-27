package kr.co.member.model.service;

import kr.co.member.model.dao.MemberDao;
import kr.co.member.model.dto.Member;
import kr.co.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    public Member selectOneMember(String memberId) {
        return memberDao.selectOneMember(memberId);
    }


    @Transactional
    public int insertMember(Member member) {
        return memberDao.insertMember(member);
    }

    public String login(Member member) {
        System.out.println("비밀번호:" + member);
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
}