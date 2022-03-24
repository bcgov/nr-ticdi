# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/ubi as builder
RUN dnf module install -y nodejs:14

# Install packages, build and keep only prod packages
WORKDIR /app
RUN npm install

# Deployment container
FROM registry.access.redhat.com/ubi8/ubi-micro

# Set node to production 
ENV NODE_ENV production

# Copy over app
WORKDIR /app

# Expose port - mostly a convention, for readability
EXPOSE 3000

# Start up command
ENTRYPOINT ["node", "start"]
