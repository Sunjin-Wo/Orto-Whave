FROM mariadb:11.8.1

# Variables de entorno para la configuración inicial
ENV MYSQL_DATABASE=ortowhave
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_USER=ortowhave
ENV MYSQL_PASSWORD=ortowhave

# Copiar el archivo SQL de inicialización
COPY ortowhave.sql /docker-entrypoint-initdb.d/

# Configurar el conjunto de caracteres y la zona horaria
ENV TZ=America/Bogota
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Exponer el puerto por defecto de MariaDB
EXPOSE 3306 