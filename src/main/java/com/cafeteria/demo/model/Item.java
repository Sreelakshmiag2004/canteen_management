package com.cafeteria.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "ITEMS")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "item_seq")
    @SequenceGenerator(
        name = "item_seq",
        sequenceName = "ISEQ$$77118",
        allocationSize = 1
    )
    private Long id;

    @Column(name = "ITEM_CODE", nullable = false)
    private Long itemCode;

    @Column(name = "ITEM_NAME", nullable = false)
    private String itemName;

    @Column(name = "A_RATE")
    @JsonProperty("aRate")
    private Double aRate;

    @Column(name = "B_RATE")
    @JsonProperty("bRate")
    private Double bRate;

    @Column(name = "C_RATE")
    @JsonProperty("cRate")
    private Double cRate;
    
    // ✅ NEW COLUMN
    @Column(name = "N_ITEMS")
    private Integer nItems;

    // getters & setters (DO NOT CHANGE NAMES)

    public Long getId() { return id; }

    public Long getItemCode() { return itemCode; }
    public void setItemCode(Long itemCode) { this.itemCode = itemCode; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Double getARate() { return aRate; }
    public void setARate(Double aRate) { this.aRate = aRate; }

    public Double getBRate() { return bRate; }
    public void setBRate(Double bRate) { this.bRate = bRate; }

    public Double getCRate() { return cRate; }
    public void setCRate(Double cRate) { this.cRate = cRate; }
    
    public Integer getNItems() { return nItems; }
    public void setNItems(Integer nItems) { this.nItems = nItems; }
}
