# Stage 1: Build the static SPA
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG BACKEND_URL
ARG OG_IMAGE_URL
ENV BACKEND_URL=${BACKEND_URL}
ENV OG_IMAGE_URL=${OG_IMAGE_URL}

RUN npx nuxt generate

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO /dev/null http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
