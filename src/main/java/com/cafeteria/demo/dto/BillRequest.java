package com.cafeteria.demo.dto;

import java.util.List;

public class BillRequest {
    public Long billId;
    public Program program;
    public List<Order> orders;

    public static class Program {
        public String programUid;
        public Integer programYear;
        public String programCallId;
        public String progNo;
        public String programName;
        public String sessionName;
        public String duration;
        public String category;
        public String coordinator;
    }

    public static class Order {
        public String serviceDate;
        public String servedTime;
        public String itemCode;
        public String itemName;
        public Integer quantity;
        public Double rate;
        public Double price;
    }
}
