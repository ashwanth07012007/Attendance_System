package com.iot.dto;

public class MLPredictionResponse {

    private String prediction;

    private double late_probability;

    private double previous_attendance_percentage;

    private String risk;


    public MLPredictionResponse() {
    }


    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }


    public double getLate_probability() {
        return late_probability;
    }

    public void setLate_probability(
            double late_probability) {

        this.late_probability =
                late_probability;
    }


    public double getPrevious_attendance_percentage() {
        return previous_attendance_percentage;
    }

    public void setPrevious_attendance_percentage(
            double previous_attendance_percentage) {

        this.previous_attendance_percentage =
                previous_attendance_percentage;
    }


    public String getRisk() {
        return risk;
    }

    public void setRisk(String risk) {
        this.risk = risk;
    }
}