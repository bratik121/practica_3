# Usa una imagen base de Node.js con la versión que estés utilizando
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install --production

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que la aplicación va a correr (Nest.js usualmente usa el 3000)
EXPOSE 3000

# Define el comando para correr la aplicación en modo producción
CMD ["npm", "run", "start:prod"]
