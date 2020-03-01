FROM node:13-slim
USER node
ENV user node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY . /home/$user/
WORKDIR /home/$user


RUN npm install
ENV PATH="/home/node/node_modules/.bin:${PATH}"

ENTRYPOINT "resume" "serve" --silent --port 8000

