FROM tomcat:9.0-jdk17

RUN rm -rf /usr/local/tomcat/webapps/*

ADD WebProgramming.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["catalina.sh", "run"]