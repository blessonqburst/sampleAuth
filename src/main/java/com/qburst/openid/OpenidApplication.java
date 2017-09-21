package com.qburst.openid;

import com.qburst.openid.auth.AuthAuthenticator;
import com.qburst.openid.auth.AuthAuthorizer;
import com.qburst.openid.auth.JWTAuthFilter;
import com.qburst.openid.auth.JsonUnauthorizedHandler;
import com.qburst.openid.core.UserRole;
import com.qburst.openid.db.ClientDao;
import com.qburst.openid.db.ClientRequestDao;
import com.qburst.openid.db.TokenDao;
import com.qburst.openid.db.UserDao;
import com.qburst.openid.health.OpenidHealthCheck;
import com.qburst.openid.resources.LoginResource;
import com.qburst.openid.resources.UserResource;
import com.qburst.openid.services.LoginService;
import com.qburst.openid.services.UserService;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.jdbi.OptionalContainerFactory;
import io.dropwizard.jersey.jackson.JsonProcessingExceptionMapper;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.skife.jdbi.v2.DBI;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;

/**
 * @author Sunil <sunilpk@qburst.com>
 * @version 0.1, 2017-03-15
 */
public class OpenidApplication extends Application<OpenidConfiguration> {

    public static void main(String[] args) throws Exception {
        new OpenidApplication().run(args);
    }

    public void initialize(final Bootstrap<OpenidConfiguration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets/views/bin/", "/", "index.html", "react"));
        bootstrap.addBundle(new AssetsBundle("/assets/views/bin/static/", "/static", null, "static"));
        bootstrap.addBundle(new AssetsBundle("/assets/views/bin/images/", "/images", null, "images"));
        bootstrap.addBundle(new AssetsBundle("/assets/views/bin/fonts/", "/fonts", null, "fonts"));
    }

    @Override
    public void run(OpenidConfiguration configuration, Environment environment) throws Exception {

        final FilterRegistration.Dynamic cors = environment.servlets().addFilter("crossOriginRequests", CrossOriginFilter.class);
        cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
        cors.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");
        cors.setInitParameter("allowedHeaders", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");
        cors.setInitParameter("allowCredentials", "true");
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");

        // Health checks
        final OpenidHealthCheck openidHealthCheck = new OpenidHealthCheck();
        environment.healthChecks().register("database", openidHealthCheck);

        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, configuration.getDataSourceFactory(), "mysql");
        jdbi.registerContainerFactory(new OptionalContainerFactory());

        final ClientDao clientDao = jdbi.onDemand(ClientDao.class);
        final ClientRequestDao clientRequestDao = jdbi.onDemand(ClientRequestDao.class);
        final UserDao userDao = jdbi.onDemand(UserDao.class);
        final TokenDao tokenDao = jdbi.onDemand(TokenDao.class);

        final LoginService loginService = new LoginService(configuration.getAuthConfiguration().getSecret(), clientDao, clientRequestDao, userDao, tokenDao);
        final UserService userService = new UserService(clientDao, userDao);

        environment.jersey().register(new LoginResource(loginService));
        environment.jersey().register(new UserResource(userService));

        environment.jersey().register(new AuthDynamicFeature(
                new JWTAuthFilter.Builder<UserRole>()
                        .setAuthenticator(new AuthAuthenticator(configuration.getAuthConfiguration().getSecret(), userDao, clientDao))
                        .setAuthorizer(new AuthAuthorizer())
                        .setPrefix("Bearer")
                        .setUnauthorizedHandler(new JsonUnauthorizedHandler())
                        .buildAuthFilter()
        ));
        environment.jersey().register(RolesAllowedDynamicFeature.class);
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(UserRole.class));
        environment.jersey().register(new JsonProcessingExceptionMapper(true));
        environment.jersey().register(RolesAllowedDynamicFeature.class);

        environment.jersey().setUrlPattern("/api/*");

        environment.servlets().addFilter("AssetServletFilter", new AssetServletFilter())
                .addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
    }
}
