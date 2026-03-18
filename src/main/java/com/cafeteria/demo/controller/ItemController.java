package com.cafeteria.demo.controller;

import com.cafeteria.demo.model.Item;
import com.cafeteria.demo.repository.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/items")
@CrossOrigin
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // ADD ITEM
    @PostMapping("/add")
public ResponseEntity<String> addItem(@RequestBody Item item) {

    if (itemRepository.findByItemCode(item.getItemCode()).isPresent()) {
        return ResponseEntity
                .badRequest()
                .body("Item code already exists");
    }
    item.setNItems(0); // ✅ DEFAULT ON ADD
    itemRepository.save(item);
    return ResponseEntity.ok("Item added successfully");
}


    // GET ALL ITEMS
    @GetMapping("/all")
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // ✅ UPDATE ITEM (THIS WAS MISSING)
    @PutMapping("/update/{itemCode}")
    @Transactional
    public String updateItem(
            @PathVariable Long itemCode,
            @RequestBody Item updatedItem) {

        Item item = itemRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setItemName(updatedItem.getItemName());
        item.setARate(updatedItem.getARate());
        item.setBRate(updatedItem.getBRate());
        item.setCRate(updatedItem.getCRate());
        
        item.setNItems(1); // ✅ SET TO 1 ON EDIT

        itemRepository.save(item);

        return "Item Updated Successfully";
    }
}

