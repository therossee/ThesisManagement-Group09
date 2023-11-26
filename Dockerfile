FROM node:latest

###############################################
##              FRONTEND                     ##
###############################################
## Build frontend
WORKDIR /build/frontend
COPY ./front-end/ .
RUN npm install
RUN npm run build
## Keep frontend build files ONLY
WORKDIR /app/frontend
RUN cp -r /build/frontend/dist/* .
RUN rm -rf /build


###############################################
##              BACKEND                      ##
###############################################
WORKDIR /app/backend
COPY ./backend/*.js ./
COPY ./backend/package*.json ./
RUN npm install --production


###############################################
##              DATABASE                     ##
###############################################
WORKDIR /app/database
COPY ./database/database.sqlite ./
COPY ./database/scripts ./scripts
RUN apt update && apt install sqlite3 -y
RUN sqlite3 database.sqlite < ./scripts/init.sql


###############################################
##              RUN                          ##
###############################################
# Install and configure apache2 web server
RUN apt update && apt install apache2 -y && echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN cp -r /app/frontend/* /var/www/html/
EXPOSE 5173
RUN sed -i 's/80/5173/g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's/80/5173/g' /etc/apache2/ports.conf
# Update apache2 config to rewrite all requests to index.html
RUN a2enmod rewrite
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf
RUN echo "<Directory /var/www/html/>" >> /etc/apache2/apache2.conf
RUN echo "RewriteEngine On" >> /etc/apache2/apache2.conf
RUN echo "RewriteBase /" >> /etc/apache2/apache2.conf
RUN echo "RewriteRule ^index\.html$ - [L]" >> /etc/apache2/apache2.conf
RUN echo "RewriteCond %{REQUEST_FILENAME} !-f" >> /etc/apache2/apache2.conf
RUN echo "RewriteCond %{REQUEST_FILENAME} !-d" >> /etc/apache2/apache2.conf
RUN echo "RewriteRule . /index.html [L]" >> /etc/apache2/apache2.conf
RUN echo "</Directory>" >> /etc/apache2/apache2.conf

# Start services (apache2 and backend)
WORKDIR /app/backend
CMD service apache2 start; npm start
