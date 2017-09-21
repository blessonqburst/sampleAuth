package com.qburst.openid.services;

import com.qburst.openid.api.response.TokenResponse;
import com.qburst.openid.api.response.UserDetails;
import com.qburst.openid.core.*;
import com.qburst.openid.db.ClientDao;
import com.qburst.openid.db.ClientRequestDao;
import com.qburst.openid.db.TokenDao;
import com.qburst.openid.db.UserDao;
import io.jsonwebtoken.*;
import io.jsonwebtoken.impl.TextCodec;
import org.json.simple.JSONObject;

import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.sql.Timestamp;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static com.qburst.openid.util.GlobalConstants.*;

public class LoginService {

    private final String secret;
    private transient final ClientDao clientDao;
    private transient final ClientRequestDao clientRequestDao;
    private transient final UserDao userDao;
    private transient final TokenDao tokenDao;

    public LoginService(String secret, final ClientDao clientDao, final ClientRequestDao clientRequestDao, UserDao userDao, TokenDao tokenDao) {
        this.secret = secret;
        this.clientDao = clientDao;
        this.clientRequestDao = clientRequestDao;
        this.userDao = userDao;
        this.tokenDao = tokenDao;
    }

    public Response.ResponseBuilder checkAndRegisterClient(Optional<String> clientName, Optional<String> redirect_uri, String oidc, String scope) throws URISyntaxException {
        if(!clientName.isPresent())
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"No client Id is provided\"}");

        final Client clientDetails = clientDao.findIfClientId(clientName.get());

        if (clientDetails == null)
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"Client Id is not registered\"}");

        clientRequestDao.registerClient(clientDetails.getId(), redirect_uri.orElse(clientDetails.getRedirectUri()), oidc, scope);
        final NewCookie cookie = new NewCookie("oidc.sid", oidc, "/", "", "", 100, false);

        response = Response.status(Response.Status.FOUND).location(new URI(AUTH_LOGIN_URL)).cookie(cookie);
        return response;
    }

    public Response.ResponseBuilder checkLogin(String email, String password, String oidc) throws URISyntaxException, UnsupportedEncodingException {
        ClientRequest clientRequest = clientRequestDao.getOidcDetails(oidc);

        if (clientRequest == null)
            return Response.status(Response.Status.FOUND).location(new URI("/login?errorMsg=Invalid+oidc"));

        try {
            final User user = userDao.getUserByClientId(email, clientRequest.getClientId());
            if (user.getPassword().equals(password)) {
                final String code = UUID.randomUUID().toString();
                final Client clientDetails = clientDao.getClientByClientId(clientRequest.getClientId());

                final String token = this.createToken(
                        clientDetails.getClientIdentity(),
                        user.getId(),
                        new Timestamp(System.currentTimeMillis())
                );

                if(tokenDao.addToken(user.getId(), token, code, new Timestamp(System.currentTimeMillis() + 1800000)) == 0) {
                    return Response.status(Response.Status.FOUND).location(new URI("/login?errorMsg=Unable+to+create+token"));
                }
                clientRequestDao.removeUsedOidc(oidc);
                return Response.status(Response.Status.FOUND).location(new URI(clientRequest.getRedirectUri() + "?code=" + code));
            } else {
                return Response.status(Response.Status.FOUND).location(new URI("/login?errorMsg=Email+and+password+does+not+match"));
            }
        } catch (NullPointerException e) {
            return Response.status(Response.Status.FOUND).location(new URI("/login?errorMsg=EmailId+does+not+exist"));
        }
    }

    private String createToken(String clientIdentity, long userId, Timestamp authTime) throws UnsupportedEncodingException {
        final long nowMillis = System.currentTimeMillis();
        final long expMillis = nowMillis + 1800000;
        final Date now = new Date(nowMillis);
        final Date expiry = new Date(expMillis);

        return Jwts.builder()
                .setIssuer("https://auth.seemymachines.com")
                .setSubject(String.valueOf(userId))
                .setAudience(String.valueOf(clientIdentity))
                .claim("exp", expiry)
                .setIssuedAt(now)
                .claim("auth_time", authTime)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Response.ResponseBuilder getToken(String grantType, String code, String redirectUri, String authHeader) {
        try {
            final String[] authZParam = new String(
                    Base64.getDecoder()
                            .decode(URLDecoder.decode(authHeader.split(" ")[1], UTF8)), UTF8)
                            .split(":");
            final Client client = clientDao.findIfClientId(authZParam[0]);

            if(!("Basic").equals(authHeader.split(" ")[0]) || client == null || !client.getClientSecret().equals(authZParam[1]))
                return Response.status(Response.Status.UNAUTHORIZED).entity("{\"message\":\"Authorization Error\"}");

            if(!grantType.equals("authorization_code"))
                return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"Invalid Grant Type\"}");
            try {
                final Token token = tokenDao.findByCode(code);
                final TokenResponse tokenResponse = new TokenResponse(
                        "Bearer",
                        token.getExpiresIn(),
                        token.getToken());
                final NewCookie cookie = new NewCookie("RP_LOGIN", token.getToken(), "/", "","",1800,false);
                return Response.ok(tokenResponse).cookie(cookie);

            } catch (NullPointerException e) {
                return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"Invalid Code\"}");
            }

        } catch (UnsupportedEncodingException e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("{\"message\":\"Authorization Error\"}");
        }
    }

    public Claims checkValidAndGetClaims(String authCookie) {
        try {
            final Claims claims = Jwts.parser()
                    .setSigningKey(TextCodec.BASE64.decode(secret))
                    .parseClaimsJws(authCookie)
                    .getBody();
            if(System.currentTimeMillis() > Long.parseLong(claims.get("exp").toString()))
                return null;
            return claims;
        } catch (JwtException e) {
            return null;
        }
    }

    public Response getNewToken(Claims claims) throws UnsupportedEncodingException {
        final String token = this.createToken(
                claims.getAudience(),
                Long.parseLong(claims.getSubject()),
                new Timestamp(System.currentTimeMillis())
        );
        final TokenResponse tokenResponse = new TokenResponse(
                "Bearer",
                new Timestamp(Long.parseLong(claims.get("exp").toString())),
                token);
        final NewCookie cookie = new NewCookie("RP_LOGIN", token, "/", "","",1800,false);
        return Response.ok(tokenResponse).cookie(cookie).build();
    }

    public Response.ResponseBuilder validateToken(JSONObject idToken) {
        System.out.println("id token is "+ idToken);
        final String token = idToken.get("id_token").toString();
        try {
            final Claims claims = Jwts.parser()
                    .setSigningKey(TextCodec.BASE64.decode(secret))
                    .parseClaimsJws(token)
                    .getBody();
            if(System.currentTimeMillis() > Long.parseLong(claims.get("exp").toString()))
                return Response.ok("{\"message\":\"Session Timed Out\"}");
            final UserRole userRole = userDao.findByUserId(
                    Long.parseLong(claims.getSubject()),
                    clientDao.findIfClientId(claims.getAudience()).getId()
            );

            return Response.ok(
                    new UserDetails(
                            userRole.getId(),
                            userRole.getName(),
                            userRole.getEmailId(),
                            userRole.getContact(),
                            token,
                            new Timestamp(Long.parseLong(claims.get("exp").toString()))
                    )
            );
        } catch (JwtException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"Invalid Id token\"}");
        }
    }
}
