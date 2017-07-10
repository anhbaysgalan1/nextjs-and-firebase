FROM mhart/alpine-node:8

ENV PORT 3000

# Need most of this to recompile node binaries.
RUN apk add --no-cache make gcc g++
RUN npm i -g yarn

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --ignore-scripts --frozen-lockfile

ADD . /app

RUN sed -E -n 's/[^#]+/export &/ p' .env >> .envvars
RUN source .envvars && yarn run build

CMD source .envvars && yarn run start

EXPOSE 3000
