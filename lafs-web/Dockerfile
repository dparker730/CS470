# Use Node.js version 10 as the base image
FROM node:10

# Set the working directory inside the container
WORKDIR /usr/src/lafs

# Copy both package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install the Angular CLI and other dependencies
RUN npm install -g @angular/cli@v6-lts
RUN npm install

# (Optional) If you are building for production, use the command below instead:
# RUN npm ci --only=production

# Copy the app source code into the container
COPY . .

# Expose port 4200 to the outside world so we can access the app
EXPOSE 4200

# Command to run the Angular app
CMD ng serve --host 0.0.0.0
