package com.qburst.openid;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.dropwizard.bundles.assets.AssetsBundleConfiguration;
import io.dropwizard.bundles.assets.AssetsConfiguration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * @author Sunil <sunilpk@qburst.com>
 * @version 0.1, 2017-03-15
 */
public class OpenidConfiguration extends Configuration implements AssetsBundleConfiguration {
    @Valid
    @NotNull
    @JsonProperty
    private final AssetsConfiguration assets = AssetsConfiguration.builder().build();

    @Override
    public AssetsConfiguration getAssetsConfiguration() {
        return assets;
    }

    @NotNull
    @Valid
    @JsonProperty
    private final DataSourceFactory dataSourceFactory
            = new DataSourceFactory();

    @Valid
    @NotNull
    @JsonProperty
    private AuthConfiguration auth = new AuthConfiguration();

    public AuthConfiguration getAuthConfiguration() {
        return auth;
    }

    @JsonProperty("database")
    public DataSourceFactory getDataSourceFactory() {
        return dataSourceFactory;
    }


}
