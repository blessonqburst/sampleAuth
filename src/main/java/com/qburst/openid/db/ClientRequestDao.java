package com.qburst.openid.db;

import com.qburst.openid.core.ClientRequest;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;

public interface ClientRequestDao {

    @SqlUpdate("insert into client_request(client_id, redirect_uri, oidc, scope) values(:client_id,:redirect_uri,:oidc, :scope)")
    void registerClient(@Bind("client_id") long clientId, @Bind("redirect_uri") String redirectUri, @Bind("oidc") String oidc, @Bind("scope") String scope);

    @RegisterMapper(ClientRequest.Mapper.class)
    @SqlQuery("select * from client_request where oidc = :oidc")
    ClientRequest getOidcDetails(@Bind("oidc") String oidc);

    @SqlUpdate("delete from client_request where oidc = :oidc")
    void removeUsedOidc(@Bind("oidc") String oidc);
}
