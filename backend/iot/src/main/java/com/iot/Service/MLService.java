package com.iot.Service;

import com.iot.dto.MLPredictionRequest;
import com.iot.dto.MLPredictionResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


@Service
public class MLService {

    private final RestClient restClient;


    public MLService() {

        this.restClient = RestClient.builder()
                .baseUrl("http://127.0.0.1:8000")
                .build();
    }


    public MLPredictionResponse predict(
            MLPredictionRequest request) {

        return restClient
                .post()
                .uri("/predict")
                .body(request)
                .retrieve()
                .body(MLPredictionResponse.class);
    }
}