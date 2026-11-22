
package com.auca.library_api.repository;

import com.auca.library_api.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    // Count active loans for a specific member
    long countByMemberIdAndReturnDateIsNull(Long memberId);

    // Check whether a book is currently borrowed
    boolean existsByBookIdAndReturnDateIsNull(Long bookId);

    // Display all active loans
    List<Loan> findByReturnDateIsNull();

    // Display borrowing history for a specific member
    List<Loan> findByMemberId(Long memberId);

}
