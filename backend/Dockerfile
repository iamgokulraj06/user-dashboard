FROM python:3.9
WORKDIR /app

RUN apt-get update
RUN apt-get upgrade -y
RUN pip install --upgrade pip
RUN pip install --upgrade fastapi uvicorn[standard] redis requests pymongo bcrypt
RUN pip install boto3
COPY . .
EXPOSE 7000
CMD ["uvicorn" , "app.app:app" , "--host" , "0.0.0.0" , "--reload" , "--port" , "7000"]
