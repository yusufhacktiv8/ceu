FROM node

# if left blank app will run with dev settings
# to build production image run:
# $ docker build ./frontend --build-args app_env=production
ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ARG token_password_env
ARG port_env
ARG aws_access_key_id_env
ARG aws_secret_access_key_env
ENV NODE_ENV $app_env
ENV TOKEN_PASSWORD $token_password_env
ENV PORT $port_env
ENV AWS_ACCESS_KEY_ID $aws_access_key_id_env
ENV AWS_SECRET_ACCESS_KEY $aws_secret_access_key_env

RUN mkdir -p /api
WORKDIR /api
COPY ./ ./

RUN yarn install
RUN yarn global add nodemon

# if dev settings will use create-react start script for hot code reloading via docker-compose shared volume
# if production setting will build optimized static files and serve using http-server
CMD if [ ${NODE_ENV} = production ]; \
	then \
	yarn start; \
	else \
	yarn run dev; \
	fi

EXPOSE 8080
