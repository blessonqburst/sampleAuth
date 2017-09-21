package com.qburst.openid.resources;

import com.qburst.openid.services.UserService;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/user")
@PermitAll
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    private transient final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @Path("/{user_id}/details")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserRoleDetails(
            @PathParam("user_id") long userId,
            @QueryParam("client_id") String clientName
    ) {
        return userService.getUserRoleDetails(userId, clientName).build();
    }

    @GET
    @Path("/clients/{user_id}")
    public Response getClientsOfUser(
            @PathParam("user_id") long userId
    ) {
        return userService.getClientsOfUser(userId).build();
    }
}
