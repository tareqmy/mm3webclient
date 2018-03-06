FROM node:alpine
LABEL creator="Tareq Mohammad Yousuf"
LABEL email="tareq.y@gmail.com"

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY ./frontend/package.json ./

RUN npm install

COPY ./frontend ./
RUN chmod +x /frontend/entrypoint.sh

EXPOSE 3000

CMD ["/frontend/entrypoint.sh"]