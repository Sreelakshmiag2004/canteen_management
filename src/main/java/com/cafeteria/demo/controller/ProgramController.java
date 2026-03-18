package com.cafeteria.demo.controller;

import com.cafeteria.demo.model.ProgramList;
import com.cafeteria.demo.dto.ProgramReportDTO;
import com.cafeteria.demo.repository.ProgramListRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program")
@CrossOrigin
public class ProgramController {

    private final ProgramListRepository repo;

    public ProgramController(ProgramListRepository repo) {
        this.repo = repo;
    }

    // 🔍 Search by UID
    @GetMapping("/uid/{uid}")
    public ProgramList getByUid(@PathVariable String uid) {
        return repo.findByProgramUid(uid);
    }

    // 🔍 Search by Year
    @GetMapping("/year/{year}")
    public List<ProgramList> getByYear(@PathVariable Integer year) {
        return repo.findByProgramYear(year);
    }

    // 📄 All programs (basic)
    @GetMapping("/all")
    public List<ProgramList> getAllPrograms() {
        return repo.findAll();
    }

    // 📊 PROGRAM REPORT WITH TOTAL
    @GetMapping("/report")
    public List<ProgramReportDTO> getProgramReport() {
        return repo.getProgramReport();
    }
    
    @GetMapping("/by-bill/{billId}")
public ProgramList getProgramByBillId(@PathVariable Long billId) {
    return repo.findByBillId(billId);
}

}


