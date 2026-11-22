package com.auca.library_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.auca.library_api.service.MemberService;
import com.auca.library_api.model.Member;
import java.util.*;


@RestController 
@RequestMapping("/api/members")
public class MemberController {
    
    @Autowired 
    private MemberService memberService;

    //display all members
    @GetMapping 
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.displayAllMembers());
    }

    //display member by id

    //save member
    @PostMapping("/save")  //api/members/save
    public ResponseEntity<String> saveMember(@RequestBody Member member) {
        String response = memberService.addMember(member);
        return ResponseEntity.ok(response);
    }




    
}
