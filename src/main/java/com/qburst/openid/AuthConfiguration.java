package com.qburst.openid;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;

public class AuthConfiguration {

    @NotEmpty
    private String id;

    @NotNull
    @JsonProperty("secret")
    private String secret;

    public String getId() {
        return id;
    }

    public String getSecret() {
        return secret;
    }
}
