package com.qburst.openid.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import javax.validation.constraints.NotNull;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Role {
    @NotNull
    @JsonProperty
    private long id;

    @NotNull
    @JsonProperty
    private long clientId;

    @NotNull
    @JsonProperty
    private String role;

    public Role(long id, long clientId, String role) {
        this.id = id;
        this.clientId = clientId;
        this.role = role;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static class Mapper implements ResultSetMapper<Role> {
        public Role map(int index, ResultSet resultSet, StatementContext statementContext) throws SQLException {
            return new Role(
                    resultSet.getLong("_id"),
                    resultSet.getLong("client_id"),
                    resultSet.getString("role_description")
            );
        }
    }
}
