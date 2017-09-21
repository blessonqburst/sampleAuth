package com.qburst.openid.api.response;

import io.dropwizard.jackson.JsonSnakeCase;

import java.sql.Timestamp;

@JsonSnakeCase
public class UserDetails {

    private long id;

    private String name;

    private String email;

    private String contact;

    private String token;

    private Timestamp expiresAt;

    public UserDetails() {
    }

    public UserDetails(long id, String name, String email, String contact, String token, Timestamp expiresAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Timestamp getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Timestamp expiresAt) {
        this.expiresAt = expiresAt;
    }
}
