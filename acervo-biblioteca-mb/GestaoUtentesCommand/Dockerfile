FROM mhart/alpine-node:8.10.0

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini
# ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app
COPY . .

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN npm install .

CMD ["node", "index.js"]