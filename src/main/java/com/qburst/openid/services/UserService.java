package com.qburst.openid.services;

import com.qburst.openid.api.response.UserClients;
import com.qburst.openid.core.Client;
import com.qburst.openid.core.User;
import com.qburst.openid.core.UserRole;
import com.qburst.openid.db.ClientDao;
import com.qburst.openid.db.UserDao;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UserService {

    private transient final ClientDao clientDao;
    private transient final UserDao userDao;

    public UserService(ClientDao clientDao, UserDao userDao) {
        this.clientDao = clientDao;
        this.userDao = userDao;
    }

    public Response.ResponseBuilder getUserRoleDetails(long userId, String clientName) {

        final Client clientDetails = clientDao.findIfClientId(clientName);
        final UserRole userDetails = userDao.getUserRoleDetails(userId, clientDetails.getId());

        if(userDetails == null)
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\"User does not exist\"}");

        return Response.ok(userDetails);
    }

    public Response.ResponseBuilder getClientsOfUser(long userId) {
        List<Client> clients;
        if(userDao.checkSuperUser(userId))
            clients = clientDao.getAllClients();
        else
            clients = clientDao.getClientsOfUser(userId);
        if(clients.isEmpty())
            return Response.ok(clients);

        List<Long> clientIds = new ArrayList<>();
        List<Long> usersList = new ArrayList<>();

        clients.forEach(client -> clientIds.add(client.getId()));
        clients.forEach(client -> usersList.add(client.getCreatedBy()));

        List<User> users = userDao.getUsersDetails(usersList);
        List<Long> clientsList = clientDao.getUserCountsOfClient(clientIds);

        return Response.ok(clients.stream()
                .map(temp -> {
                            long userCount = clientsList.stream().filter(integer -> integer == temp.getId()).count();
                            String createdBy = users.stream().filter(user -> user.getId() == temp.getCreatedBy()).findAny().get().getName();
                            return new UserClients(
                                    temp.getId(),
                                    temp.getClientIdentity(),
                                    temp.getClientSecret(),
                                    temp.getRedirectUri(),
                                    temp.getPermissionUri(),
                                    createdBy,
                                    temp.getCreatedDt(),
                                    userCount
                            );
                        }
                ).collect(Collectors.toList()));
    }
}
