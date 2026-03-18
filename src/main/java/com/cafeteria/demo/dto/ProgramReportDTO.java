package com.cafeteria.demo.dto;

import java.util.Date;

public class ProgramReportDTO {

    private Long billId;
    private String programUid;
    private Integer programYear;
    private String programName;
    private String sessionName;
    private Date dateFrom;
    private Date dateTo;
    private String category;
    private String coordinator;
    private Double totalAmount;

    public ProgramReportDTO(
            Long billId,
            String programUid,
            Integer programYear,
            String programName,
            String sessionName,
            Date dateFrom,
            Date dateTo,
            String category,
            String coordinator,
            Double totalAmount
    ) {
        this.billId = billId;
        this.programUid = programUid;
        this.programYear = programYear;
        this.programName = programName;
        this.sessionName = sessionName;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.category = category;
        this.coordinator = coordinator;
        this.totalAmount = totalAmount;
    }

    public Long getBillId() { return billId; }
    public String getProgramUid() { return programUid; }
    public Integer getProgramYear() { return programYear; }
    public String getProgramName() { return programName; }
    public String getSessionName() { return sessionName; }
    public Date getDateFrom() { return dateFrom; }
    public Date getDateTo() { return dateTo; }
    public String getCategory() { return category; }
    public String getCoordinator() { return coordinator; }
    public Double getTotalAmount() { return totalAmount; }
}

