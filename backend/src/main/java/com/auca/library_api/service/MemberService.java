package com.auca.library_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.auca.library_api.model.Member;
import com.auca.library_api.repository.MemberRepository;
import java.util.*;

@Service 
public class MemberService {
    
    @Autowired
    public MemberRepository memberRepository;

    //display all members
    public List<Member> displayAllMembers() {
        return memberRepository.findAll();
    }

    //display member bt id(search by id)
    public Optional<Member>displayMemberById(Long UUID) {
        return memberRepository.findById(UUID);
    }

    //save member
    public String addMember(Member member) {

        //check if member exists
        
        if(member.getId() != null && memberRepository.existsById(member.getId())) {
            return "Member already exists.";
        }
        memberRepository.save(member);   
        return "member saved successfully";
    }

    //delete a member
    public String deleteMember(Long UUID) {
        if (!memberRepository.existsById(UUID)) return "Member does not exist";
        memberRepository.deleteById(UUID);
        return "Member deleted successfully";
    }

    //update member

}
