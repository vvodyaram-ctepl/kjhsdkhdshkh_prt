# Stage 1
FROM node:10.15.3 as build
ARG BRANCH
WORKDIR /app
COPY . .
ENV BRANCH $BRANCH
RUN echo $BRANCH 
RUN npm install
RUN echo $BRANCH 
RUN npm run $BRANCH
##RUN npm run --$BRANCH
##RUN ls -al dist/
RUN ls -al dist/wearables
RUN ls -al dist/wearables/assets
# Stage 2
FROM tomcat:9.0.65
RUN ls -al /usr/local/tomcat/conf/
RUN rm -R /usr/local/tomcat/webapps/ROOT || true \
    && rm -R /usr/local/tomcat/webapps/docs || true \
	&& rm -R /usr/local/tomcat/webapps/examples || true \
	&& rm -R /usr/local/tomcat/webapps/host-manager || true \
	&& rm -R /usr/local/tomcat/webapps/manager || true \
	&& rm -f /usr/local/tomcat/conf/web.xml || true
RUN mkdir /usr/local/tomcat/webapps/ROOT
#COPY --from=build /app/dist/wearables/* /usr/local/tomcat/webapps/ROOT/
COPY --from=build /app/dist/wearables/assets/web.xml /usr/local/tomcat/conf/web.xml
COPY --from=build /app/dist/wearables /usr/local/tomcat/webapps/ROOT
COPY --from=build /app/dist/wearables/assets/error.html /usr/local/tomcat/webapps/ROOT/error.html
RUN ls -al /usr/local/tomcat/webapps/
RUN ls -al /usr/local/tomcat/webapps/ROOT/
EXPOSE 8080
CMD ["catalina.sh", "run"]
#FROM nginx:1.21.0
#RUN rm -rf /usr/share/nginx/html/*
#COPY --from=build /app/dist /usr/share/nginx/html
#RUN ls -al /usr/share/nginx/html
#ENTRYPOINT ["nginx", "-g", "daemon off;"]