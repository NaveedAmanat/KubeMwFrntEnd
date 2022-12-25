FROM node:12-alpine as builder

COPY package.json package-lock.json ./

RUN npm i && mkdir /kashf && mv ./node_modules ./kashf

WORKDIR /kashf

COPY . .

RUN $(npm bin)/ng build --output-path=dist

FROM nginx:1.14.1-alpine

#COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /kashf/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
