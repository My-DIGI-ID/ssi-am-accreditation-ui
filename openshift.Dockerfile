FROM node:14-slim as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package.json
COPY package-lock.json package-lock.json
# docker-cache friendly version of npm i
RUN npm ci --legacy-peer-deps
# precompile imported angular modules to cache part of the build or server startup process
RUN npx ngcc
COPY . /usr/src/app
# RUN npx ng lint
# don't build when intending to use for live development mode
ARG CONFIGURATION=production

RUN if [ "serve" != ${CONFIGURATION} ] ; then npx ng build --output-path=dist --configuration=$CONFIGURATION ; fi
# expose ports, create env and ng serve
ARG VERSION=latest
ENV SSIBK_ACCREDITATION_UI_VERSION=${VERSION}
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--watch", "--disable-host-check=true", "--poll", "2000"]
# Stage 2: Run stage
FROM nginx:1.18.0-alpine
RUN apk update && apk add jq
RUN apk add --upgrade libssl1.1 libcrypto1.1 libgd libxml2 libcurl curl apk-tools libgcrypt
# Copy the nginx configuration
COPY ./ops/nginx.conf /etc/nginx/conf.d/default.conf
# Copy build from the 'build environment'
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 4200
# generate dynamic json from env
COPY ./ops/docker-entrypoint.prod.sh /docker-entrypoint.sh

## Added to fix permission problems when starting in openshift
RUN chmod 777 -R /usr/share/nginx && touch /usr/share/nginx/html/assets/config/config.json && chmod 777 /usr/share/nginx/html/assets/config/config.json
RUN chmod 777 -R /var/cache/nginx && chmod 777 -R /etc/nginx && chmod 777 -R /var/run

RUN ["chmod", "+x", "/docker-entrypoint.sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
ARG VERSION=latest
ENV SSIBK_ACCREDITATION_UI_VERSION=${VERSION}
CMD ["nginx", "-g", "daemon off;"]