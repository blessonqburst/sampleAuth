package com.qburst.openid.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import javax.validation.constraints.NotNull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class Token {

    @NotNull
    @JsonProperty
    private long id;

    @NotNull
    @JsonProperty
    private int userId;

    @NotNull
    @JsonProperty
    private String token;

    @JsonProperty
    private String code;

    @JsonProperty
    private Timestamp expiresIn;

    public Token(long id, int userId, String token, String code, Timestamp expiresIn) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.code = code;
        this.expiresIn = expiresIn;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Timestamp getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Timestamp expiresIn) {
        this.expiresIn = expiresIn;
    }

    public static class Mapper implements ResultSetMapper<Token> {
        public Token map(int index, ResultSet resultSet, StatementContext statementContext) throws SQLException {
            return new Token(
                    resultSet.getInt("_id"),
                    resultSet.getInt("user_id"),
                    resultSet.getString("token"),
                    resultSet.getString("code"),
                    resultSet.getTimestamp("expires_in")
            );
        }
    }
}
