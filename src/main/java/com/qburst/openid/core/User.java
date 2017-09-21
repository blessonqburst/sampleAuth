package com.qburst.openid.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import javax.validation.constraints.NotNull;
import java.security.Principal;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;

public class User implements Principal {

    @NotNull
    @JsonProperty
    private long id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String emailId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String password;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private Date dob;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String contact;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String nationality;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String address;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @NotNull
    @JsonProperty
    private String gender;

    @JsonIgnore
    private int accessFlag;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotNull
    @JsonProperty
    private String role;

    public User(long id, String emailId, String name) {
        this.id = id;
        this.emailId = emailId;
        this.name = name;
    }

    public User(long id, String emailId, String name, String contact, String role) {
        this.id = id;
        this.emailId = emailId;
        this.name = name;
        this.contact = contact;
        this.role = role;
    }

    public User(long id, String emailId, String name, String contact, String role, String password) {
        this.id = id;
        this.emailId = emailId;
        this.name = name;
        this.contact = contact;
        this.role = role;
        this.password = password;
    }

    public User(long id, String emailId, String name, String password, Date dob, String contact, String nationality, String address, String gender, int accessFlag) {
        this.id = id;
        this.emailId = emailId;
        this.name = name;
        this.password = password;
        this.dob = dob;
        this.contact = contact;
        this.nationality = nationality;
        this.address = address;
        this.gender = gender;
        this.accessFlag = accessFlag;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAccessFlag() {
        return accessFlag;
    }

    public void setAccessFlag(int accessFlag) {
        this.accessFlag = accessFlag;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static class Mapper implements ResultSetMapper<User> {
        public User map(int index, ResultSet resultSet, StatementContext statementContext) throws SQLException {
            return new User(
                    resultSet.getLong("_id"),
                    resultSet.getString("email_id"),
                    resultSet.getString("name"),
                    resultSet.getString("password"),
                    resultSet.getDate("dob"),
                    resultSet.getString("contact"),
                    resultSet.getString("nationality"),
                    resultSet.getString("address"),
                    resultSet.getString("gender"),
                    resultSet.getInt("access_flag")
            );
        }
    }
}
