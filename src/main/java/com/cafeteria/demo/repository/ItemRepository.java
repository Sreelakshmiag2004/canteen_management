package com.cafeteria.demo.repository;

import com.cafeteria.demo.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByItemCode(Long itemCode);
}




