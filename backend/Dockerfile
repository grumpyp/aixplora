FROM python:3.10.12-slim

WORKDIR /usr/src/app

# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy required files/folders
COPY backend .
COPY misc .
# COPY qdrant_data .

EXPOSE 8000

CMD [ "python", "main.py" ]
