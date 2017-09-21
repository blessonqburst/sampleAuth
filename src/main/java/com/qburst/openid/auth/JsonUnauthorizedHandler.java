package com.qburst.openid.auth;

import com.google.common.collect.ImmutableMap;
import io.dropwizard.auth.UnauthorizedHandler;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class JsonUnauthorizedHandler implements UnauthorizedHandler {

    private static final String CHALLENGE_FORMAT = "%s realm=\"%s\"";

    @Override
    public Response buildResponse(String prefix, String realm) {
        return Response.status(Response.Status.UNAUTHORIZED)
                .header(HttpHeaders.WWW_AUTHENTICATE,
                        String.format(CHALLENGE_FORMAT, prefix, realm))
                .type(MediaType.APPLICATION_JSON_TYPE)
                .entity(ImmutableMap.of(
                        "code", "401",
                        "message", "Credentials are required to access this resource."))
                .build();
    }
}
