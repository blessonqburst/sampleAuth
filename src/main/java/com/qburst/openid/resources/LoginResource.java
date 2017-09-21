package com.qburst.openid.resources;

import com.codahale.metrics.annotation.Timed;
import com.qburst.openid.services.LoginService;
import io.jsonwebtoken.Claims;
import org.hibernate.validator.constraints.NotEmpty;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.Optional;
import java.util.UUID;

import static com.qburst.openid.util.GlobalConstants.*;


@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class LoginResource {

    private transient final LoginService loginService;

    public LoginResource(final LoginService loginService) {
        this.loginService = loginService;
    }

    @GET
    @Path("/auth")
    @Timed
    public Response viewAuthLogin(
            @QueryParam("response_type") final Optional<String> responseType,
            @QueryParam("client_id") final Optional<String> clientName,
            @QueryParam("redirect_uri") final Optional<String> redirectUri,
            @QueryParam("scope") final String scope,
            @CookieParam("RP_LOGIN") final Optional<String> authCookie
    ) throws URISyntaxException, UnsupportedEncodingException {
        if(authCookie.isPresent()) {
            final Claims claims = loginService.checkValidAndGetClaims(authCookie.get());
            if(claims != null)
                return loginService.getNewToken(claims);
        }
        if(responseType.isPresent() && responseType.get().equals("code")) {
            final String oidc = UUID.randomUUID().toString();
             response = loginService.checkAndRegisterClient(clientName, redirectUri, oidc, scope);
        } else {
            response = Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"Response_type should be code\"}");
        }
        return response.build();
    }

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response onlogin(
            @FormParam("login_id") String email,
            @FormParam("password") String password,
            @FormParam("oidc") String oidc
    ) throws URISyntaxException, UnsupportedEncodingException {
        response = loginService.checkLogin(email, password, oidc);
        return response.build();
    }

    @POST
    @Path("/token")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Timed
    public Response getToken(
            @FormParam("grant_type") @NotEmpty final String grantType,
            @FormParam("code") @NotEmpty final String code,
            @FormParam("redirect_uri") final String redirectUri,
            @HeaderParam("Authorization") @NotEmpty final String authHeader
    ) throws UnsupportedEncodingException, URISyntaxException, ParseException {
        response = loginService.getToken(grantType, code, redirectUri, authHeader);
        return response.build();
    }

    @POST
    @Path("/token/validate")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @PermitAll
    public Response validateToken(
            final JSONObject idToken
    ) throws UnsupportedEncodingException {
        System.out.println("idToken is " + idToken);
        response = this.loginService.validateToken(idToken);
        return response.build();
    }

}
