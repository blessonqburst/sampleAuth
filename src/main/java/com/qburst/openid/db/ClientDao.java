package com.qburst.openid.db;

import com.qburst.openid.core.Client;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.stringtemplate.UseStringTemplate3StatementLocator;
import org.skife.jdbi.v2.unstable.BindIn;

import java.util.List;

@UseStringTemplate3StatementLocator
public interface ClientDao {

    @RegisterMapper(Client.Mapper.class)
    @SqlQuery("select * from client where client_identity = :client_identity")
    Client findIfClientId(@Bind("client_identity") String clientIdentity);

    @RegisterMapper(Client.Mapper.class)
    @SqlQuery("select * from client where _id = :client_id")
    Client getClientByClientId(@Bind("client_id") long clientId);

    @RegisterMapper(Client.Mapper.class)
    @SqlQuery("select * from client")
    List<Client> getAllClients();

    @RegisterMapper(Client.Mapper.class)
    @SqlQuery("select * from client where _id IN (select client_id from user_permission where user_id = :user_id)")
    List<Client> getClientsOfUser(@Bind("user_id") long user_id);

    @SqlQuery("select client_id from user_permission where client_id IN (<clientId>)")
    List<Long> getUserCountsOfClient(@BindIn("clientId") List<Long> clientIds);
}
