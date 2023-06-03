FROM python:3.8.12-slim-buster

WORKDIR /usr/src/app

# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "main.py" ]
