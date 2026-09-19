package com.iot.dto;

public class MLPredictionRequest {

    private int previous_days;
    private int previous_late_count;
    private double previous_late_percentage;

    public MLPredictionRequest() {
    }

    public MLPredictionRequest(
            int previous_days,
            int previous_late_count,
            double previous_late_percentage) {

        this.previous_days = previous_days;
        this.previous_late_count = previous_late_count;
        this.previous_late_percentage = previous_late_percentage;
    }

    public int getPrevious_days() {
        return previous_days;
    }

    public void setPrevious_days(int previous_days) {
        this.previous_days = previous_days;
    }

    public int getPrevious_late_count() {
        return previous_late_count;
    }

    public void setPrevious_late_count(int previous_late_count) {
        this.previous_late_count = previous_late_count;
    }

    public double getPrevious_late_percentage() {
        return previous_late_percentage;
    }

    public void setPrevious_late_percentage(
            double previous_late_percentage) {

        this.previous_late_percentage =
                previous_late_percentage;
    }
}