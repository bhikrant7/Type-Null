from fastapi import FastAPI, File, UploadFile, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from typing import Annotated
from chatbot import initialize_llm, create_vectorstore_from_pdf, create_vectorstore_from_video,create_chain
from chatbot import prompt, prompt_title, get_roadmap, find_mistakes, create_vectorstore_from_text
from accuracy import get_accuracy, find_missing_info, find_missing_keywords
import shutil
import os

class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        max_size = 50 * 1024 * 1024  # 50MB limit
        if request.headers.get("content-length"):
            content_length = int(request.headers["content-length"])
            if content_length > max_size:
                return JSONResponse({"error": "File too large"}, status_code=413)
        return await call_next(request)

UPLOAD_DIR = "uploads"
VECTOR_DB_PATH = "chroma_db"
AUDIO_DIR = "vid_to_audio_data"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]  # Allow files to be received
)

app.add_middleware(LimitUploadSizeMiddleware)

# initialize llm
llm = initialize_llm()

@app.get("/hello")
async def hello():
  return "Hello"

@app.post("/upload-pdf",  status_code=200)
async def get_pdf(file: Annotated[UploadFile, File()]):

  print("Upload pdf route hit")
  # save the pdf 
  file_path = os.path.join(UPLOAD_DIR, file.filename)
  with open(file_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  # create and store vectordb
  vector_db_path = os.path.join(VECTOR_DB_PATH, file.filename)
  create_vectorstore_from_pdf(file_path, vector_db_path)

  print("Vectorstore stored in: ", vector_db_path)
  print("Pdf parsing done")

  return {"message": "Success"}


@app.post("/upload-video",  status_code=200)
async def get_video(file: Annotated[UploadFile, File()]):

  print("Upload video route hit")
  # save the video
  file_path = os.path.join(UPLOAD_DIR, file.filename)

  # store audio files extracted from video for transcription
  audio_path = os.path.join(AUDIO_DIR, f"{file.filename}.wav")

  with open(file_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  # create and store vectordb
  vector_db_path = os.path.join(VECTOR_DB_PATH, file.filename)
  create_vectorstore_from_video(file_path, vector_db_path, audio_path)

  print("Vectorstore stored in: ", vector_db_path)
  print("Video parsing done")

  return {"message": "Success"}


@app.post("/upload-notes", status_code=200)
async def get_notes(notes: Annotated[str, Body()], note_id: Annotated[str, Body()]):

  print("Upload notes route hit")
  vector_db_path = os.path.join(VECTOR_DB_PATH, note_id)
  create_vectorstore_from_text(notes, vector_db_path)

  print("Vectorstore stored in: ", vector_db_path)
  print("Notes parsing done")

  return {"message": "Success"}


@app.post("/chat")
async def chat(query: Annotated[str, Body()], filename: Annotated[str, Body()]):
  print("Chat route hit")
  vector_db_path = os.path.join(VECTOR_DB_PATH, filename)

  chain = create_chain(llm, vector_db_path)
  llm_response = prompt(chain, query)

  return {"message": llm_response}


@app.post("/chat-with-notes")
async def chat(query: Annotated[str, Body()], note_id: Annotated[str, Body()]):
  print("Chat with notes route hit")
  vector_db_path = os.path.join(VECTOR_DB_PATH, note_id)
  chain = create_chain(llm, vector_db_path)
  llm_response = prompt(chain, query)
  return {"message": llm_response}


# @app.post("/get-accuracy")
# async def chat(title: Annotated[str, Body()], text: Annotated[str, Body()], filename: Annotated[str, Body()]):
#   print("get accuracy route hit")
#   vector_db_path = os.path.join(VECTOR_DB_PATH, filename)
#   chain = create_chain(llm, vector_db_path)
  
#   print("Prompting llm")
#   llm_note = prompt_title(chain, title)
#   print("Getting accuracy")
#   accuracy = get_accuracy(llm_note, text)
  
#   print({"accuracy": accuracy, "user_note": text, "llm_note": llm_note})
#   return {"accuracy": accuracy, "user_note": text, "llm_note": llm_note}


@app.post("/get-analysis")
async def chat(title: Annotated[str, Body()], text: Annotated[str, Body()], filename: Annotated[str, Body()]):
  print("find missing info route hit")
  vector_db_path = os.path.join(VECTOR_DB_PATH, filename)
  chain = create_chain(llm, vector_db_path)
  
  print("Prompting llm")
  llm_note = prompt_title(chain, title)

  print("Getting accuracy")
  accuracy = get_accuracy(llm_note, text)
  
  print("Finding missing info")
  missing_info = find_missing_info(text, llm_note)

  print("Finding missing keywords")
  missing_keywords = find_missing_keywords(text, llm_note)
  
  print("Finding roadmap")
  roadmap = get_roadmap(llm=llm, keywords=missing_keywords, paragraph=llm_note)
  
  # print("Finding mistakes")
  # mistakes = find_mistakes(llm=llm, user_note=note, llm_note=llm_note)
  
  print({"accuracy": accuracy, "missing_info": missing_info, "missing_keywords": missing_keywords, "roadmap": roadmap, "user_note": text, "llm_note": llm_note})
  return {"accuracy": accuracy, "missing_info": missing_info, "missing_keywords": missing_keywords, "roadmap": roadmap, "user_note": text, "llm_note": llm_note}

