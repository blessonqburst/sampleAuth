package com.qburst.openid.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.jackson.JsonSnakeCase;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import javax.validation.constraints.NotNull;
import java.security.Principal;
import java.sql.ResultSet;
import java.sql.SQLException;

@JsonSnakeCase
public class UserRole implements Principal{

    @NotNull
    @JsonProperty
    private long id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String emailId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String contact;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotNull
    @JsonProperty
    private String role;

    public UserRole(long id, String name, String emailId, String contact, String role) {
        this.id = id;
        this.name = name;
        this.emailId = emailId;
        this.contact = contact;
        this.role = role;
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

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static class Mapper implements ResultSetMapper<UserRole> {
        public UserRole map(int index, ResultSet resultSet, StatementContext statementContext) throws SQLException {
            return new UserRole(
                    resultSet.getLong("_id"),
                    resultSet.getString("name"),
                    resultSet.getString("email_id"),
                    resultSet.getString("contact"),
                    resultSet.getString("role_description")
            );
        }
    }
}
