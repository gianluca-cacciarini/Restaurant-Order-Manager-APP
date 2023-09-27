#Dockerfile, Image, Container

FROM python:3.10.6

COPY webpage.py .
COPY static static
COPY templates templates

RUN pip install flask flask_restful requests Response requests flask_cors sqlalchemy 

CMD ["python3","./webpage.py"]
