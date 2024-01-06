FROM node:18.19.0

###############################################
##              FRONTEND                     ##
###############################################
## Build frontend
WORKDIR /build/frontend
COPY ./front-end/ .
RUN npm install --ignore-scripts && \
    npm rebuild @swc/core esbuild && \
    npm run build
## Keep frontend build files ONLY
WORKDIR /app/frontend
RUN cp -r /build/frontend/dist/* . && rm -rf /build


###############################################
##              BACKEND                      ##
###############################################
WORKDIR /app/backend
COPY ./backend/*.pem ./backend/.env.vault ./backend/package*.json ./
COPY ./backend/src ./src/
RUN npm install --production --ignore-scripts && \
    npm rebuild better-sqlite3 ljharb-monorepo-symlink-test


###############################################
##              DATABASE                     ##
###############################################
WORKDIR /app/database
COPY ./database/database.sqlite ./
COPY ./database/scripts ./scripts
RUN apt update && \
    apt --no-install-recommends install sqlite3 -y && \
    apt clean && \
    sqlite3 database.sqlite < ./scripts/init.sql


###############################################
##              RUN                          ##
###############################################
# Install and configure apache2 web server
RUN apt update && \
    apt --no-install-recommends install apache2 -y && \
    apt clean && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf && \
    cp -r /app/frontend/* /var/www/html/ && \
# Update default port (80) to our port (5173)
    sed -i 's/80/5173/g' /etc/apache2/sites-available/000-default.conf && \
    sed -i 's/80/5173/g' /etc/apache2/ports.conf && \
# Update apache2 config to rewrite all requests to index.html
    a2enmod rewrite && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf && \
    echo "<Directory /var/www/html/>" >> /etc/apache2/apache2.conf && \
    echo "RewriteEngine On" >> /etc/apache2/apache2.conf && \
    echo "RewriteBase /" >> /etc/apache2/apache2.conf && \
    echo "RewriteRule ^index\.html$ - [L]" >> /etc/apache2/apache2.conf && \
    echo "RewriteCond %{REQUEST_FILENAME} !-f" >> /etc/apache2/apache2.conf && \
    echo "RewriteCond %{REQUEST_FILENAME} !-d" >> /etc/apache2/apache2.conf && \
    echo "RewriteRule . /index.html [L]" >> /etc/apache2/apache2.conf && \
    echo "</Directory>" >> /etc/apache2/apache2.conf

EXPOSE 5173
# Start services (apache2 and backend)
WORKDIR /app/backend
CMD service apache2 start; npm start
