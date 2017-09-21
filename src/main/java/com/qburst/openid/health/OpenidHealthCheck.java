package com.qburst.openid.health;

import com.codahale.metrics.health.HealthCheck;

/**
 * @author Sunil <sunilpk@qburst.com>
 * @version 0.1, 2017-03-15
 */

public class OpenidHealthCheck extends HealthCheck {

    /**
     * @throws Exception
     */
    @Override
    protected Result check() throws Exception {

        return Result.healthy();
    }
}
