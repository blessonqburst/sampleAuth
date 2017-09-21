package com.qburst.openid;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;

/**
 * @author Sunil <sunilpk@qburst.com>
 * @version 0.1, 2017-03-15
 */
public class DBConfiguration {

    @NotEmpty
    @JsonProperty
    private String servers;

    @NotEmpty
    @JsonProperty
    private String databaseName;

    @NotNull
    @JsonProperty("login_url")
    private String loginUrl;

    public final String getServers() {
        return servers;
    }

    public final String getDatabaseName() {
        return databaseName;
    }

    public String getloginUrl() {
        return loginUrl;
    }

}
