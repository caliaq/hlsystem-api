# Set the correct project ID
$PROJECT_ID="hlsystem-460320"

# Build the Docker image with the correct registry path
docker build -t gcr.io/$PROJECT_ID/express-visitors-api .

# Push the image to Google Container Registry
docker push gcr.io/$PROJECT_ID/express-visitors-api 

# Deploy to Google Cloud Run
gcloud run deploy visitors-api --image gcr.io/$PROJECT_ID/express-visitors-api --platform managed --region europe-west1 --allow-unauthenticated --set-env-vars="MONGODB_URI=mongodb+srv://ejaprrr:ZxcXbkT9ok3DBJFM@lom.i8676.mongodb.net/?retryWrites=true&w=majority&appName=lom"