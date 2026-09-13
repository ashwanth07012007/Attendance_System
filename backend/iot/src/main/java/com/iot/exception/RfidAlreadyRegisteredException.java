package com.iot.exception;

public class RfidAlreadyRegisteredException extends RuntimeException {

    public RfidAlreadyRegisteredException(String message) {
        super(message);
    }
}