#Dockerfile, Image, Container

FROM python:3.10.6

COPY . .

RUN pip install flask flask_restful flask_sqlalchemy flask_sqlalchemy sqlalchemy requests flask_cors argparse datetime

CMD ["python3","-u","./orders.py"]
