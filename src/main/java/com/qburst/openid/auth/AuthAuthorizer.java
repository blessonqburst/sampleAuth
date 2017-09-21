package com.qburst.openid.auth;

import com.qburst.openid.core.UserRole;
import io.dropwizard.auth.Authorizer;

public class AuthAuthorizer implements Authorizer<UserRole> {

    public AuthAuthorizer() {
    }

    @Override
    public boolean authorize(UserRole userRole, String role) {
        return role.equals(userRole.getRole());
    }

}
