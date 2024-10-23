# Usa una imagen base de Node.js con la versión que estés utilizando
FROM node:18-alpine as prod-deps

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install --production

FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:18-alpine
# Expone el puerto en el que la aplicación va a correr (Nest.js usualmente usa el 3000)
EXPOSE 3000
WORKDIR /usr/src/app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Define el comando para correr la aplicación en modo producción
CMD ["npm", "run", "start:prod"]
