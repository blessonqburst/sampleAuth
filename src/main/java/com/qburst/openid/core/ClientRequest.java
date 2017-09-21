package com.qburst.openid.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import javax.validation.constraints.NotNull;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ClientRequest {
    @NotNull
    @JsonProperty
    private long id;

    @NotNull
    @JsonProperty
    private long clientId;

    @NotNull
    @JsonProperty
    private String redirectUri;

    @NotNull
    @JsonProperty
    private String oidc;

    @NotNull
    @JsonProperty
    private String scope;

    public ClientRequest() {
    }

    public ClientRequest(long id, long clientId, String redirectUri, String oidc, String scope) {
        this.id = id;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.oidc = oidc;
        this.scope = scope;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getClientId() {
        return clientId;
    }

    public void setClientId(long clientId) {
        this.clientId = clientId;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getOidc() {
        return oidc;
    }

    public void setOidc(String oidc) {
        this.oidc = oidc;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public static class Mapper implements ResultSetMapper<ClientRequest> {
        public ClientRequest map(int index, ResultSet resultSet, StatementContext statementContext) throws SQLException {
            return new ClientRequest(
                    resultSet.getLong("_id"),
                    resultSet.getLong("client_id"),
                    resultSet.getString("redirect_uri"),
                    resultSet.getString("oidc"),
                    resultSet.getString("scope")
            );
        }
    }
}
