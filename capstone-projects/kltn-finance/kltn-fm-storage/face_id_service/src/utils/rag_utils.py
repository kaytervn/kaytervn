from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceHub
import os

API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

def load_and_split_pdf(file_path):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return splitter.split_documents(documents)

def create_vector_db(docs, db_path="faiss_index"):
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(db_path)
    return db

def load_vector_db(db_path="faiss_index"):
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local(
        folder_path=db_path,
        embeddings=embeddings,
        allow_dangerous_deserialization=True
    )

def get_qa_chain():
    retriever = load_vector_db().as_retriever()

    llm = HuggingFaceHub(
        repo_id="google/flan-t5-large",
        model_kwargs={
            "temperature": 0.5,
            "max_length": 512
        },
        huggingfacehub_api_token=API_TOKEN
    )

    return RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
