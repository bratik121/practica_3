# Usa una imagen base de Node.js con la versión que estés utilizando
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json desde la raíz del proyecto
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código fuente desde la raíz del proyecto
COPY . .

# Compila la aplicación
RUN npm run build

# Expone el puerto en el que la aplicación va a correr (Nest.js usualmente usa el 3000)
EXPOSE 3000

# Define el comando para correr la aplicación en modo producción
CMD ["npm", "run", "start:prod"]
