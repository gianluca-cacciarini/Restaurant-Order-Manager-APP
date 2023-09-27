#Dockerfile, Image, Container

FROM python:3.10.6

COPY . .

RUN pip install flask flask_restful requests flask_cors

CMD ["python3","-u","./order_simulator.py"]
