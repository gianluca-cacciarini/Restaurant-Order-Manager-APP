#Dockerfile, Image, Container

FROM python:3.10.6

COPY . .

RUN pip install flask flask_restful requests Response requests flask_cors sqlalchemy flask_sqlalchemy flask_login flask_wtf wtforms flask_bcrypt

CMD ["python3","./authentication.py"]
