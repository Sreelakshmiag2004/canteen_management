package com.cafeteria.demo.service;

import com.cafeteria.demo.dto.BillRequest;
import com.cafeteria.demo.model.ProgramList;
import com.cafeteria.demo.model.OrderedList;
import com.cafeteria.demo.repository.ProgramListRepository;
import com.cafeteria.demo.repository.OrderedListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BillService {

    private final ProgramListRepository programRepo;
    private final OrderedListRepository orderRepo;

    public BillService(ProgramListRepository programRepo,
                       OrderedListRepository orderRepo) {
        this.programRepo = programRepo;
        this.orderRepo = orderRepo;
    }

    /* =====================================================
       1️⃣ CREATE NEW PROGRAM + GENERATE BILL ID
       (When program details are entered from UI)
       ===================================================== */
    @Transactional
    public Long generateBill(BillRequest request) {

        System.out.println("===== GENERATE BILL STARTED =====");

        ProgramList program = new ProgramList();
        program.setProgramUid(request.program.programUid);
        program.setProgramYear(request.program.programYear);
        program.setProgramCallId(request.program.programCallId);
        program.setProgNo(request.program.progNo);
        program.setProgramName(request.program.programName);
        program.setSessionName(request.program.sessionName);
        program.setDuration(request.program.duration);
        program.setCategory(request.program.category);
        program.setCoordinator(request.program.coordinator);

        ProgramList savedProgram = programRepo.save(program);

        System.out.println("Program saved with BILL ID: " + savedProgram.getBillId());

        if (request.orders != null && !request.orders.isEmpty()) {
            for (BillRequest.Order order : request.orders) {
                saveSingleOrder(savedProgram.getBillId(), order);
            }
        }

        System.out.println("===== GENERATE BILL COMPLETED =====");
        return savedProgram.getBillId();
    }

    /* =====================================================
       2️⃣ SAVE BILL ITEMS FOR EXISTING PROGRAM
       (When program already exists in PROGRAM_LIST)
       ===================================================== */
    @Transactional
    public void saveOrders(Long billId, List<BillRequest.Order> orders) {

        System.out.println("===== SAVE ORDERS STARTED =====");
        System.out.println("Using existing BILL ID: " + billId);

        if (orders == null || orders.isEmpty()) {
            System.out.println("No order items received");
            return;
        }

        for (BillRequest.Order order : orders) {
            saveSingleOrder(billId, order);
        }

        System.out.println("===== SAVE ORDERS COMPLETED =====");
    }

    /* =====================================================
       COMMON METHOD – SAVE SINGLE ORDER ITEM
       ===================================================== */
    private void saveSingleOrder(Long billId, BillRequest.Order order) {

        OrderedList orderedItem = new OrderedList();
        orderedItem.setBillId(billId);
        orderedItem.setServiceDate(order.serviceDate);
        orderedItem.setServedTime(order.servedTime);
        orderedItem.setItemCode(order.itemCode);
        orderedItem.setItemName(order.itemName);
        orderedItem.setQuantity(order.quantity);
        orderedItem.setRate(order.rate);
        orderedItem.setPrice(order.price);

        orderRepo.save(orderedItem);

        System.out.println("Saved item: " + order.itemName);
    }
}

