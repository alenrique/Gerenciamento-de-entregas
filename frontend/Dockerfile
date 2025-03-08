# Usa uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Constrói o aplicativo Next.js
RUN npm run build

# Expõe a porta que o aplicativo vai rodar
EXPOSE 3000

# Comando para rodar o aplicativo
CMD ["npm", "start"]