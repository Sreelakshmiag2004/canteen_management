package com.cafeteria.demo.repository;

import com.cafeteria.demo.model.OrderedList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderedListRepository extends JpaRepository<OrderedList, Long> {

    // 🔑 THIS IS REQUIRED FOR POPUP
    List<OrderedList> findByBillId(Long billId);
    void deleteByBillId(Long billId);
}

