FROM node:20-bookworm-slim

WORKDIR /app

# 1) Copiar solo manifiestos del backend e instalar dentro del contenedor
COPY backend/package*.json ./backend/
RUN cd backend && npm ci

# 2) Copiar SOLO el código fuente del backend (NO node_modules)
COPY backend/src ./backend/src
COPY backend/jest.config.js ./backend/jest.config.js
COPY backend/.eslintrc.json ./backend/.eslintrc.json
COPY backend/tests ./backend/tests

# 3) Copiar frontend
COPY frontend ./frontend

ENV PORT=3000
ENV NODE_ENV=production
ENV DB_PATH=/data/data.sqlite

EXPOSE 3000
VOLUME ["/data"]

CMD ["node", "backend/src/app.js"]

