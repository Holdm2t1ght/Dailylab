from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from domain.diary import diaryService

import test_router
from domain.todo.routers import getInfoFromSpring_router, todo

app = FastAPI()

origins = [
    "*"
]

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 통신하는 주소에 따라 조정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# gpt 3.5 일기 작성
@app.post("/diary/default")
async def createDiary(param: dict):
    data = diaryService.createDiary(param, "gpt-3.5-turbo-16k")
    return data

# gpt 4 일기 작성
@app.post("/diary/confirm")
async def createDiary(param: dict):
    data = diaryService.createDiary(param, "gpt-4")
    return data

app.include_router(test_router.router)
app.include_router(getInfoFromSpring_router.router)
app.include_router(todo.router)

if __name__ == "__main__":
    import uvicorn
    # from [module_name] import app # FastAPI 객체 가져오기

    # 8081 포트번호에서 FastAPI 어플리케이션 수신 대기
    uvicorn.run(app, host="0.0.0.0", port=8181)