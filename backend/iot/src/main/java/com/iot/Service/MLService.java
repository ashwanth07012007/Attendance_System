package com.iot.Service;

import com.iot.dto.MLPredictionRequest;
import com.iot.dto.MLPredictionResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


@Service
public class MLService {

    private final RestClient restClient;

    public MLService(@Value("${ml.api.url}") String mlApiUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(mlApiUrl)
                .build();
    }

    public MLPredictionResponse predict(MLPredictionRequest request) {

        return restClient.post()
                .uri("/predict")
                .body(request)
                .retrieve()
                .body(MLPredictionResponse.class);
    }
}