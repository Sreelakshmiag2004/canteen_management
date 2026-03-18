/*package com.cafeteria.demo.controller;

import com.cafeteria.demo.dto.BillRequest;
import com.cafeteria.demo.service.BillService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bill")
@CrossOrigin
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping("/generate")
    public Long generateBill(@RequestBody BillRequest request) {
         System.out.println("Controller HIT");
    System.out.println("Program UID: " + request.program.programUid);
    System.out.println("Orders count: " + request.orders.size());

        return billService.generateBill(request);
    }
    @PostMapping("/save-orders")
    public void saveOrders(@RequestBody BillRequest request) {
    System.out.println("Saving orders for BILL ID: " + request.billId);
    billService.saveOrders(request.billId, request.orders);
}

}
*/

package com.cafeteria.demo.controller;

import com.cafeteria.demo.dto.BillRequest;
import com.cafeteria.demo.service.BillService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bill")
@CrossOrigin
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    /* =========================================
       CREATE NEW PROGRAM + BILL
       ========================================= */
    @PostMapping("/generate")
    public Long generateBill(@RequestBody BillRequest request) {

        System.out.println("===== GENERATE BILL CONTROLLER =====");

        if (request.program == null) {
            throw new RuntimeException("Program details missing");
        }

        System.out.println("Program UID: " + request.program.programUid);
        System.out.println("Orders count: " +
                (request.orders == null ? 0 : request.orders.size()));

        return billService.generateBill(request);
    }

    /* =========================================
       SAVE ITEMS FOR EXISTING PROGRAM
       ========================================= */
    @PostMapping("/save-orders")
    public void saveOrders(@RequestBody BillRequest request) {

        System.out.println("===== SAVE ORDERS CONTROLLER =====");

        if (request.billId == null) {
            throw new RuntimeException("Bill ID is required");
        }

        if (request.orders == null || request.orders.isEmpty()) {
            System.out.println("No orders received");
            return;
        }

        System.out.println("Saving orders for BILL ID: " + request.billId);
        billService.saveOrders(request.billId, request.orders);
    }
}

