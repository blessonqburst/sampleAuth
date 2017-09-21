package com.qburst.openid.api.response;

import io.dropwizard.jackson.JsonSnakeCase;

import java.sql.Timestamp;

@JsonSnakeCase
public class TokenResponse {

    private String tokenType;

    private Timestamp expiresIn;

    private String idToken;

    public TokenResponse(String tokenType, Timestamp expiresIn, String idToken) {
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.idToken = idToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Timestamp getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Timestamp expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
