FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY app/ .

EXPOSE 8228

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]