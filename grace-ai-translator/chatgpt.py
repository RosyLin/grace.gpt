# Import necessary libraries
from flask import Flask, request, jsonify
import os
import openai
from flask_cors import CORS
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.llms import OpenAI
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader
import constants

# Setup Flask
app = Flask(__name__)
CORS(app)

# Constants and Environment Variables
os.environ["OPENAI_API_KEY"] = constants.APIKEY  # Replace with your API key
PERSIST = False
DATA_FILE_PATH = "C:/gracegpt/stage2/data.txt"  # Path to your data file

# Initialize the ChatGPT model and index
def initialize_model():
    if PERSIST and os.path.exists("persist"):
        vectorstore = Chroma(persist_directory="persist", embedding_function=OpenAIEmbeddings())
        index = VectorStoreIndexWrapper(vectorstore=vectorstore)
    else:
        loader = TextLoader(DATA_FILE_PATH)
        if PERSIST:
            index = VectorstoreIndexCreator(vectorstore_kwargs={"persist_directory": "persist"}).from_loaders([loader])
        else:
            index = VectorstoreIndexCreator().from_loaders([loader])

    chain = ConversationalRetrievalChain.from_llm(
        llm=ChatOpenAI(model="gpt-3.5-turbo"),
        retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
    )
    return chain


chain = initialize_model()

# Define the route to handle translation requests
@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    word = data.get('word')
    if not word:
        return jsonify({"error": "No word provided"}), 400

    # Use the chain to process the word and get the translation
    result = chain({"question": word, "chat_history": []})
    return jsonify({"translation": result['answer']})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
