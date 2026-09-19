package com.iot.controller;

import com.iot.dto.MLPredictionRequest;
import com.iot.dto.MLPredictionResponse;
import com.iot.Service.MLService;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class MLController {

    private final MLService mlService;


    public MLController(
            MLService mlService) {

        this.mlService = mlService;
    }


    @PostMapping("/predict")
    public MLPredictionResponse predict(
            @RequestBody MLPredictionRequest request) {

        return mlService.predict(request);
    }
}