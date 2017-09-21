package com.qburst.openid.db;

import com.qburst.openid.core.User;
import com.qburst.openid.core.UserRole;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.stringtemplate.UseStringTemplate3StatementLocator;
import org.skife.jdbi.v2.unstable.BindIn;

import java.util.List;

@UseStringTemplate3StatementLocator
public interface UserDao {

    @RegisterMapper(User.Mapper.class)
    @SqlQuery("select * from user where email_id = :email_id and access_flag = 1 and _id in (select user_id from user_permission where client_id = :client_id)")
    User getUserByClientId(@Bind("email_id") String emailId, @Bind("client_id") long clientId);

    @RegisterMapper(UserRole.Mapper.class)
    @SqlQuery("select e._id, name, email_id, contact, role_description from user e, user_permission f, role g where e._id = :user_id and e._id = f.user_id and f.role_id = g._id and f.client_id = :client_id")
    UserRole getUserRoleDetails(@Bind("user_id") long userId, @Bind("client_id") long clientId);

    @SqlQuery("select true from role where role_description = \"Super-User\" and _id IN (select role_id from user_permission where user_id = :userId)")
    boolean checkSuperUser(@Bind("userId") long userId);

    @RegisterMapper(User.Mapper.class)
    @SqlQuery("select * from user where _id IN (<id>)")
    List<User> getUsersDetails(@BindIn("id") List<Long> usersList);

    @RegisterMapper(UserRole.Mapper.class)
    @SqlQuery("select e._id, e.name, e.email_id, e.contact, f.role_description from user e, role f where e._id = :userId and f._id = (select u.role_id from user_permission u where u.user_id = :userId and u.client_id = :clientId)")
    UserRole findByUserId(@Bind("userId") long userId, @Bind("clientId") long clientId);
}
