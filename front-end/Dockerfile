FROM nginx

COPY nginx.conf /etc/nginx
COPY . /usr/share/nginx/html

RUN apt-get update
RUN apt-get install -y nano