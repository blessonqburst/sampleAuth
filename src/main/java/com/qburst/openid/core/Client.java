package com.qburst.openid.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import javax.validation.constraints.NotNull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class Client {
    @NotNull
    @JsonProperty
    private long id;

    @NotNull
    @JsonProperty
    private String clientIdentity;

    @NotNull
    @JsonProperty
    private String clientSecret;

    @NotNull
    @JsonProperty
    private String redirectUri;

    @NotNull
    @JsonProperty
    private String permissionUri;

    @NotNull
    @JsonProperty
    private long createdBy;

    @NotNull
    @JsonProperty
    private Timestamp createdDt;

    @NotNull
    @JsonProperty
    private long updatedBy;

    @NotNull
    @JsonProperty
    private Timestamp updatedDt;

    public Client() {
    }

    public Client(final long id, final String clientIdentity, final String clientSecret, final String redirectUri, final String permissionUri, final long createdBy, final Timestamp createdDt, final long updatedBy, final Timestamp updatedDt) {
        this.id = id;
        this.clientIdentity = clientIdentity;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.permissionUri = permissionUri;
        this.createdBy = createdBy;
        this.createdDt = createdDt;
        this.updatedBy = updatedBy;
        this.updatedDt = updatedDt;
    }

    public long getId() {
        return id;
    }

    public void setId(final long id) {
        this.id = id;
    }

    public String getClientIdentity() {
        return clientIdentity;
    }

    public void setClientIdentity(final String clientIdentity) {
        this.clientIdentity = clientIdentity;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(final String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(final String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getPermissionUri() {
        return permissionUri;
    }

    public void setPermissionUri(String permissionUri) {
        this.permissionUri = permissionUri;
    }

    public long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(final long createdBy) {
        this.createdBy = createdBy;
    }

    public Timestamp getCreatedDt() {
        return createdDt;
    }

    public void setCreatedDt(final Timestamp createdDt) {
        this.createdDt = createdDt;
    }

    public long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(final long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Timestamp getUpdatedDt() {
        return updatedDt;
    }

    public void setUpdatedDt(final Timestamp updatedDt) {
        this.updatedDt = updatedDt;
    }

    public static class Mapper implements ResultSetMapper<Client> {
        public Client map(int index, ResultSet resultSet, StatementContext statementContext) throws SQLException {
            return new Client(
                    resultSet.getLong("_id"),
                    resultSet.getString("client_identity"),
                    resultSet.getString("client_secret"),
                    resultSet.getString("redirect_uri"),
                    resultSet.getString("permission_uri"),
                    resultSet.getLong("created_by"),
                    resultSet.getTimestamp("created_dt"),
                    resultSet.getLong("updated_by"),
                    resultSet.getTimestamp("updated_dt")
            );
        }
    }

}
