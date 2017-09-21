package com.qburst.openid.api.response;

import io.dropwizard.jackson.JsonSnakeCase;

import java.sql.Timestamp;

@JsonSnakeCase
public class UserClients {

    private long clientId;

    private String clientIdentity;

    private String clientSecret;

    private String redirectUri;

    private String permissionUri;

    private String createdBy;

    private Timestamp createdDt;

    private long userCount;

    public UserClients() {
    }

    public UserClients(long clientId, String clientIdentity, String clientSecret, String redirectUri, String permissionUri, String createdBy, Timestamp createdDt, long userCount) {
        this.clientId = clientId;
        this.clientIdentity = clientIdentity;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.permissionUri = permissionUri;
        this.createdBy = createdBy;
        this.createdDt = createdDt;
        this.userCount = userCount;
    }

    public long getClientId() {
        return clientId;
    }

    public void setClientId(long clientId) {
        this.clientId = clientId;
    }

    public String getClientIdentity() {
        return clientIdentity;
    }

    public void setClientIdentity(String clientIdentity) {
        this.clientIdentity = clientIdentity;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getPermissionUri() {
        return permissionUri;
    }

    public void setPermissionUri(String permissionUri) {
        this.permissionUri = permissionUri;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Timestamp getCreatedDt() {
        return createdDt;
    }

    public void setCreatedDt(Timestamp createdDt) {
        this.createdDt = createdDt;
    }

    public long getUserCount() {
        return userCount;
    }

    public void setUserCount(long userCount) {
        this.userCount = userCount;
    }
}
