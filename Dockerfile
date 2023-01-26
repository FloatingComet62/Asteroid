FROM node:19
WORKDIR /

COPY package.json yarn.lock ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY . .

RUN yarn --frozen-lockfile

ENV NODE_ENV=production

CMD yarn serve