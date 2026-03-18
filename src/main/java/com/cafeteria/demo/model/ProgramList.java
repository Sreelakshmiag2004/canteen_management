package com.cafeteria.demo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "program_list")
public class ProgramList {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bill_seq")
    @SequenceGenerator(
        name = "bill_seq",
        sequenceName = "program_list_seq",
        allocationSize = 1
    )
    private Long billId;

    private String programUid;
    private Integer programYear;
    private String programCallId;
    private String progNo;
    private String programName;
    private String sessionName;
    private String duration;
    private String category;
    private String coordinator;

    @Temporal(TemporalType.DATE)
    private Date dateFrom;

    @Temporal(TemporalType.DATE)
    private Date dateTo;

    /* ---------- GETTERS & SETTERS ---------- */

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public String getProgramUid() {
        return programUid;
    }

    public void setProgramUid(String programUid) {
        this.programUid = programUid;
    }

    public Integer getProgramYear() {
        return programYear;
    }

    public void setProgramYear(Integer programYear) {
        this.programYear = programYear;
    }

    public String getProgramCallId() {
        return programCallId;
    }

    public void setProgramCallId(String programCallId) {
        this.programCallId = programCallId;
    }

    public String getProgNo() {
        return progNo;
    }

    public void setProgNo(String progNo) {
        this.progNo = progNo;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getSessionName() {
        return sessionName;
    }

    public void setSessionName(String sessionName) {
        this.sessionName = sessionName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCoordinator() {
        return coordinator;
    }

    public void setCoordinator(String coordinator) {
        this.coordinator = coordinator;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }
}

