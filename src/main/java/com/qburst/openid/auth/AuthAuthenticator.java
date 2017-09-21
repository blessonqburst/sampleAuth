package com.qburst.openid.auth;

import com.qburst.openid.core.UserRole;
import com.qburst.openid.db.ClientDao;
import com.qburst.openid.db.UserDao;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.TextCodec;

import java.util.Optional;

public class AuthAuthenticator implements Authenticator<String, UserRole> {

    private final String secret;
    private final UserDao userDao;
    private final ClientDao clientDao;

    public AuthAuthenticator(String secret, UserDao userDao, ClientDao clientDao) {
        this.secret = secret;
        this.userDao = userDao;
        this.clientDao = clientDao;
    }

    @Override
    public Optional<UserRole> authenticate(String compactJws) throws AuthenticationException {
        System.out.println("jwt is "+ compactJws);
        final Claims claims = Jwts.parser()
                .setSigningKey(TextCodec.BASE64.decode(secret))
                .parseClaimsJws(compactJws)
                .getBody();

        final long userId = Long.parseLong(claims.getSubject());
        final long clientId = clientDao.findIfClientId(claims.getAudience()).getId();

        return Optional.ofNullable(userDao.findByUserId(userId, clientId));
    }
}
