package com.qburst.openid.db;

import com.qburst.openid.core.Token;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;

import java.sql.Timestamp;

public interface TokenDao {

    @SqlUpdate("insert into token(user_id, token, code, expires_in) values(:user_id, :token, :code, :expires_in)")
    int addToken(@Bind("user_id") long userId, @Bind("token") String token, @Bind("code") String code, @Bind("expires_in") Timestamp expiry);

    @RegisterMapper(Token.Mapper.class)
    @SqlQuery("call get_token(:code)")
    Token findByCode(@Bind("code") String code);
}
