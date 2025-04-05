from langchain_openai import ChatOpenAI 
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.output_parsers import StructuredOutputParser, ResponseSchema


from transcriber import extract_audio, transcribe_audio


# ✅ Global cache for retrievers to avoid reloading
retriever_cache = {}


def initialize_llm():
  # OpenRouter API Key
  OPEN_ROUTER_API_KEY = "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"

  # Initialize LLM
  llm = ChatOpenAI(
      model="deepseek/deepseek-chat-v3-0324:free",  
      openai_api_key=OPEN_ROUTER_API_KEY,
      openai_api_base="https://openrouter.ai/api/v1"
  )

  print("LLM initialized")
  return llm


def create_vectorstore_from_pdf(file_path, vector_db_path):
  print("Creating vectorstore from pdf")
  if vector_db_path in retriever_cache:
        print(f"🔄 Using cached vectorstore for {vector_db_path}")
        return retriever_cache[vector_db_path]
      
  loader = PyPDFLoader(file_path)
  documents = loader.load()

  text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
  chunks = text_splitter.split_documents(documents)

  embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
  vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory=vector_db_path)
  vectorstore.persist()  # Save vector database
  
  # ✅ Cache the vectorstore
  retriever = vectorstore.as_retriever()
  retriever_cache[vector_db_path] = retriever

  print("Vectorstore created at: ", vector_db_path)
  return vectorstore


def create_vectorstore_from_video(file_path, vector_db_path, audio_path):
  print("Creating vectorstore from video")
  if vector_db_path in retriever_cache:
        print(f"🔄 Using cached vectorstore for {vector_db_path}")
        return retriever_cache[vector_db_path]
    
  extract_audio(file_path, audio_path)
  texts = transcribe_audio(audio_path)
  
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
  chunks = text_splitter.create_documents([texts])

  embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
  vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory=vector_db_path)
  
  # ✅ Cache the vectorstore
  retriever = vectorstore.as_retriever()
  retriever_cache[vector_db_path] = retriever

  return vectorstore


def create_vectorstore_from_text(texts, vector_db_path):
  print("Creating vectorstore from notes")
  if vector_db_path in retriever_cache:
        print(f"🔄 Using cached vectorstore for {vector_db_path}")
        return retriever_cache[vector_db_path]
  
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
  chunks = text_splitter.create_documents([texts])

  embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
  vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory=vector_db_path)
  
  # ✅ Cache the vectorstore
  retriever = vectorstore.as_retriever()  # Convert to retriever
  retriever_cache[vector_db_path] = retriever


def get_retriever(vector_db_path):
  """Retrieves a cached retriever or loads from disk if not in cache"""
  if vector_db_path in retriever_cache:
      print(f"🔄 Using cached retriever for {vector_db_path}")
      return retriever_cache[vector_db_path]

  print(f"🆕 Loading retriever from disk: {vector_db_path}")
  vectorstore = Chroma(persist_directory=vector_db_path, embedding_function=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"))
  retriever = vectorstore.as_retriever()
  
  # ✅ Cache the retriever for future use
  retriever_cache[vector_db_path] = retriever
  return retriever


def create_chain(llm, vector_db_path):
  """Creates a RetrievalQA chain using Chroma's retriever"""
  retriever = get_retriever(vector_db_path)
  chain = RetrievalQA.from_chain_type(
      llm=llm,
      chain_type="stuff",
      retriever=retriever
  )

  print("✅ Chain created")
  return chain


def prompt(chain, query):
  print(f"Prompting ... \nprompt: {query}")
  response = chain.invoke({"query": query}) 
  return response["result"]


# fetch data based on title
def prompt_title(chain, query):
  response = chain.invoke({"query": f"explain {query}"})
  return response["result"]


def find_mistakes(llm, user_note, llm_note):
  prompt = f"""You are a tutor, the following paragraph are the facts {llm_note} 
  Your student wrote {user_note}
  Rectify his mistakes"""
  
  response = llm.invoke(prompt)
  return response.content


def get_roadmap(llm, keywords, paragraph):
  schema = [
        ResponseSchema(name="topics", description="List of study topics")
    ]
  parser = StructuredOutputParser.from_response_schemas(schema)
    
  keywords_str = ", ".join(keywords)
  prompt = f"""
    {keywords_str} ... you are a tutor. The above keywords were found missing in the student's notes: "{paragraph}".
    Suggest study topics that cover these missing areas.
    Provide only a JSON list format like this: {{"topics": ["Topic1", "Topic2", "Topic3"]}}
    """
  
  response = llm.predict(prompt)
  return parser.parse(response)["topics"]
  