package com.smartemergency.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Services")
@Data
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer serviceId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String price;

    private String icon = "bi-gear-fill";
}