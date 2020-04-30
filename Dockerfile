FROM node:13.3.0 AS compile-image

RUN npm install -g yarn
RUN npm install -g @angular/cli

WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN ng build --prod

FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf 
COPY --from=compile-image /opt/ng/dist/app-name /usr/share/nginx/html
