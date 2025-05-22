#!/bin/bash

PROJECT_ID="hlsystem-460320"
TAG=$(date +%Y%m%d%H%M%S)

# Přihlášení a konfigurace projektu
gcloud auth login
gcloud config set project $PROJECT_ID
gcloud auth configure-docker

# Build image pro linux/amd64
docker build --platform=linux/amd64 --no-cache -t gcr.io/$PROJECT_ID/express-visitors-api:$TAG .

# Push na GCR
docker push gcr.io/$PROJECT_ID/express-visitors-api:$TAG

# Deploy do Cloud Run
gcloud run deploy visitors-api \
  --image gcr.io/$PROJECT_ID/express-visitors-api:$TAG \
  --platform managed \
  --region europe-west1 \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=mongodb+srv://ejaprrr:ZxcXbkT9ok3DBJFM@lom.i8676.mongodb.net/?retryWrites=true&w=majority&appName=lom"