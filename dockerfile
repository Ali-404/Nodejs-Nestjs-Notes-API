# Step 1: Use a Node.js base image for building
FROM node:18-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependencies
COPY package*.json ./

# Step 4: Install all dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Generate Prisma Client
RUN npx prisma generate

# Step 7: Build the NestJS app
RUN npm run build


# Step 8: Use a minimal Node.js image for the production build
FROM node:18-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# Step 9: Copy the built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
# Ensure Prisma files are copied
COPY --from=build /app/prisma ./prisma  

# Step 10: Install only production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Step 11: Command to run the application
CMD ["node", "dist/main"]
