package com.qburst.openid;


import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by manikandan on 12/5/17.
 */
public class AssetServletFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if (servletRequest instanceof HttpServletRequest) {
            HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
            if (httpServletRequest.getRequestURI().startsWith("/static") || httpServletRequest.getRequestURI().startsWith("/api") || httpServletRequest.getRequestURI().startsWith("/images") || httpServletRequest.getRequestURI().startsWith("/fonts"))
                filterChain.doFilter(servletRequest, servletResponse);
            else
                servletRequest.getRequestDispatcher("/").forward(servletRequest, servletResponse);
        }
    }

    @Override
    public void destroy() {
    }
}
