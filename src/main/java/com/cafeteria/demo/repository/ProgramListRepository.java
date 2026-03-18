package com.cafeteria.demo.repository;

import com.cafeteria.demo.model.ProgramList;
import com.cafeteria.demo.dto.ProgramReportDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProgramListRepository extends JpaRepository<ProgramList, Long> {

    // 🔍 Search by UID
    ProgramList findByProgramUid(String programUid);
    
    ProgramList findByBillId(Long billId);

    // 🔍 Search by Year
    List<ProgramList> findByProgramYear(Integer programYear);

    // ✅ REPORT QUERY (PROGRAM + TOTAL AMOUNT)
    @Query("""
        SELECT new com.cafeteria.demo.dto.ProgramReportDTO(
            p.billId,
            p.programUid,
            p.programYear,
            p.programName,
            p.sessionName,
            p.dateFrom,
            p.dateTo,
            p.category,
            p.coordinator,
            COALESCE(SUM(o.price), 0)
        )
        FROM ProgramList p
        LEFT JOIN OrderedList o ON p.billId = o.billId
        GROUP BY
            p.billId,
            p.programUid,
            p.programYear,
            p.programName,
            p.sessionName,
            p.dateFrom,
            p.dateTo,
            p.category,
            p.coordinator
    """)
    List<ProgramReportDTO> getProgramReport();
}
