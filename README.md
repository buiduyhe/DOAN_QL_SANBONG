1. Clone the project from its repository:
```bash
git clone https://github.com/buiduyhe/DOAN_QL_SANBONG.git
```
2 set up chạy api 
```bash
cd ql-sanbong-api
```
2.1 Create virtual environment
```bash
python -m venv env
```
2.2. kích hoạt môi trường ảo
```bash
env/Scripts/activate
```
2.3. cài thư viện
```bash
pip install -r requirements.txt
```
2.4. Run the FastAPI server:
```bash
uvicorn main:app --reload
```
----->>>> sau này khi có sẵn chạy như này
```bash
cd ql-sanbong-api
env/Scripts/activate
uvicorn main:app --reload
```

3. Navigate into the project directory:
```bash
cd ql-sanbong-fe
```
3.1 Create virtual environment
```bash
npm install
npm install react-router-dom
npm start
```
