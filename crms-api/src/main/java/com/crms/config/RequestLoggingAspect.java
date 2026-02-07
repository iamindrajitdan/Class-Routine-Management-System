package com.crms.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Request/Response Logging using Spring AOP
 * Requirements: 13.1, 13.2, 13.5
 */
@Aspect
@Component
public class RequestLoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingAspect.class);

    @Around("execution(* com.crms.controller..*(..))")
    public Object logRequestResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            
            long startTime = System.currentTimeMillis();
            
            logger.info("Request: {} {} from {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    request.getRemoteAddr());
            
            Object result;
            try {
                result = joinPoint.proceed();
                
                long duration = System.currentTimeMillis() - startTime;
                logger.info("Response: {} {} completed in {}ms",
                        request.getMethod(),
                        request.getRequestURI(),
                        duration);
                
                return result;
            } catch (Exception e) {
                long duration = System.currentTimeMillis() - startTime;
                logger.error("Response: {} {} failed in {}ms with error: {}",
                        request.getMethod(),
                        request.getRequestURI(),
                        duration,
                        e.getMessage());
                throw e;
            }
        }
        
        return joinPoint.proceed();
    }
}
