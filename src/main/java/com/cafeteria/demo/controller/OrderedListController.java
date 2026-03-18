/*package com.cafeteria.demo.controller;

import com.cafeteria.demo.model.OrderedList;
import com.cafeteria.demo.repository.OrderedListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordered-list")
@CrossOrigin
public class OrderedListController {

    @Autowired
    private OrderedListRepository orderedListRepository;

    @GetMapping("/by-bill/{billId}")
    public List<OrderedList> getItemsByBillId(@PathVariable Long billId) {
        return orderedListRepository.findByBillId(billId);
    }
}
*/







/*package com.cafeteria.demo.controller;

import com.cafeteria.demo.model.OrderedList;
import com.cafeteria.demo.repository.OrderedListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordered-list")
@CrossOrigin
public class OrderedListController {

    @Autowired
    private OrderedListRepository orderedListRepository;

  
    @GetMapping("/by-bill/{billId}")
    public List<OrderedList> getItemsByBillId(@PathVariable Long billId) {
        return orderedListRepository.findByBillId(billId);
    }

    @PostMapping("/save/{billId}")
    public void saveItemsForBill(
            @PathVariable Long billId,
            @RequestBody List<OrderedList> items) {

        
        for (OrderedList item : items) {
            item.setBillId(billId);
        }

      
        orderedListRepository.saveAll(items);
    }

   
    @DeleteMapping("/{orderId}")
    public void deleteItem(@PathVariable Long orderId) {
        orderedListRepository.deleteById(orderId);
    }

    @DeleteMapping("/by-bill/{billId}")
    public void deleteItemsByBill(@PathVariable Long billId) {
        orderedListRepository.deleteByBillId(billId);
    }
}
*/



package com.cafeteria.demo.controller;

import com.cafeteria.demo.model.OrderedList;
import com.cafeteria.demo.repository.OrderedListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordered-list")
@CrossOrigin
public class OrderedListController {

    @Autowired
    private OrderedListRepository orderedListRepository;

    /* ===============================
       GET ITEMS BY BILL ID
       Used in Edit Bill page load
       =============================== */
    @GetMapping("/by-bill/{billId}")
    public List<OrderedList> getItemsByBillId(@PathVariable Long billId) {
        return orderedListRepository.findByBillId(billId);
    }

    /* ===============================
       SAVE UNSAVED ITEMS
       Called when user presses SAVE BILL
       =============================== */
    @PostMapping("/save/{billId}")
    public void saveItemsForBill(
            @PathVariable Long billId,
            @RequestBody List<OrderedList> items) {

        for (OrderedList item : items) {
            // 🔐 ensure correct bill id
            item.setBillId(billId);
        }

        // save all new items
        orderedListRepository.saveAll(items);
    }

    /* ===============================
       DELETE SINGLE ITEM (OPTIONAL)
       For future edit/delete
       =============================== */
    @DeleteMapping("/{orderId}")
    public void deleteItem(@PathVariable Long orderId) {
        orderedListRepository.deleteById(orderId);
    }

    /* ===============================
       DELETE ALL ITEMS BY BILL ID
       (Optional – if you add Delete Bill)
       =============================== */
    @DeleteMapping("/by-bill/{billId}")
    public void deleteItemsByBill(@PathVariable Long billId) {
        orderedListRepository.deleteByBillId(billId);
    }
}
