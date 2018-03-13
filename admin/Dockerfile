FROM node

# if left blank app will run with dev settings
# to build production image run:
# $ docker build ./frontend --build-args app_env=production
ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV NODE_ENV $app_env

RUN mkdir -p /admin
WORKDIR /admin
COPY ./ ./

RUN yarn install

# if dev settings will use create-react start script for hot code relaoding via docker-compose shared volume
# if production setting will build optimized static files and serve using http-server
CMD if [ ${NODE_ENV} = production ]; \
	then \
	yarn global add http-server && \
	yarn run build && \
	cd build && \
	hs -p 3000; \
	else \
	yarn start; \
	fi

EXPOSE 3000
