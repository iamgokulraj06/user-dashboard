FROM node:20.12.2 as build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm run i

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80