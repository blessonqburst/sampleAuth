package com.qburst.openid.util;

public class GlobalFunctions {

    public static final String getAccessToken(int count) {
        final String tokenString = "abcdef0123456789";
        final StringBuilder builder = new StringBuilder();
        while (count-- != 0) {
            final int character = (int) (Math.random() * tokenString.length());
            builder.append(tokenString.charAt(character));
        }
        return builder.toString();
    }

    public static final String getUserHash(final int userId) {
        final long now = System.currentTimeMillis();
        final String builder = String.valueOf(now).concat(String.valueOf(userId));
        return builder;
    }
}
