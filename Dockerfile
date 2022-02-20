FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# There's an issue with one dependency if this is not done
RUN sed -i '/openssl_conf/c\#openssl_conf' /etc/ssl/openssl.cnf

# This and the below are needed as the pdf files are in bulgarian
RUN apt-get update && apt-get install -y locales

ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU:ru
ENV LC_LANG ru_RU.UTF-8
ENV LC_ALL ru_RU.UTF-8

CMD ["bash", "start.sh"]