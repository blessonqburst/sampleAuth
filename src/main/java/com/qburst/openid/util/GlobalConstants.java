package com.qburst.openid.util;

import org.json.simple.JSONObject;

import javax.ws.rs.core.Response;

public class GlobalConstants {

    public static final Response.ResponseBuilder badError = Response.status(Response.Status.BAD_REQUEST);
    public static final Response.ResponseBuilder authError = Response.status(Response.Status.UNAUTHORIZED);
    public static final Response.ResponseBuilder foundResponse = Response.status(Response.Status.FOUND);
    public static final JSONObject returnStatus = new JSONObject();
    public static final String CODE = "code";
    public static final String STATUS = "status";
    public static final String DATA = "data";
    public static final String AUTH_CODE = "authorization_code";
    public static final String AUTH_ERROR = "Authorization Error";
    public static final String INV_PARAM = "Invalid Parameter";
    public static final String AUTH_TIME = "auth_time";
    public static final String INV_OIDC = "Invalid oidc";
    public static final String CLIENT_ID = "client_id";
    public static final String CLIENT_SECRET = "client_secret";
    public static final String USER_ID = "user_id";
    public static final String PASSWORD = "password";
    public static final String TOKEN = "token";
    public static final String REFRESH_TOKEN = "refresh_token";
    public static final String EXPIRY = "expiry";
    public static final String OIDC = "oidc";
    public static final String SCOPE = "scope";
    public static final String EMAIL_ID = "email_id";
    public static final String REDIRECT_URI = "redirect_uri";
    public static final String AUTH_LOGIN_URL = "/auth/login";
    public static final String UTF8 = "utf8";
    public static Response.ResponseBuilder response;
}
