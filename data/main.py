from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 통신하는 주소에 따라 조정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

if __name__ == "__main__":
    import uvicorn
    # from [module_name] import app # FastAPI 객체 가져오기

    # 8081 포트번호에서 FastAPI 어플리케이션 수신 대기
    uvicorn.run(app, host="0.0.0.0", port=8181)