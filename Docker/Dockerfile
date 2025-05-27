FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY ./backend /app
# Añadimos un comando para ver el contenido del directorio y verificar la estructura
RUN ls -la
# Ejecutamos Maven con el flag para ver más información sobre el proceso de compilación
RUN mvn clean package -DskipTests -X

# Verificamos si se generó el JAR
RUN ls -la target/ || echo "No se generó el archivo JAR"

FROM openjdk:17-jdk-slim
WORKDIR /app
# Modificamos esta línea para usar un comodín y encontrar cualquier JAR generado
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
