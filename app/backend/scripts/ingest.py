from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_pdf(pdf_path, collection_name, qdrant_url, qdrant_api_key):
    """
    Processes a PDF file, splits it into chunks, and stores the embeddings in Qdrant.

    Args:
        pdf_path (str): Path to the PDF file.
        collection_name (str): Name of the Qdrant collection.
        qdrant_url (str): Qdrant server URL.
        qdrant_api_key (str): Qdrant API key.
        embedding_model (str): OpenAI embedding model name.

    Returns:
        str: Success message.
    """
    # Load PDF
    loader = TextLoader(pdf_path, encoding="utf-8")
    pages = loader.load()
    print(f"Loaded {len(pages)} pages from the PDF.")
    for i, page in enumerate(pages[:3]):
        print(f"[Page {i+1} content preview]:")
        print(repr(page.page_content[:300]))

    # Chunk Text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    docs = text_splitter.split_documents(pages)

    # OpenAI Embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Qdrant Setup
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)

    # Create Collection (if not exists)
    if collection_name not in [c.name for c in client.get_collections().collections]:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

    # Qdrant Langchain Vector Store
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )

    # Ingest the chunks
    res = vector_store.add_documents(docs)

    print(res)

    return f"PDF processed and stored in Qdrant collection '{collection_name}' successfully."

# Example usage
if __name__ == "__main__":
    pdf_path = "C:/Users/drago/Desktop/Sem6/thesis/ortho-vision/srd_extracted_text.txt"
    collection_name = "knowledge_base"
    qdrant_url = "https://256bc441-1429-429e-9979-0c86a49d523e.eu-central-1-0.aws.cloud.qdrant.io:6333"
    qdrant_api_key = "IpyGrMlAtVqguM1ki5Cj2AGq_H-MWPE5l3lRy4co5jx4SrufCwXG1Q"

    result = process_pdf(pdf_path, collection_name, qdrant_url, qdrant_api_key)
    print(result)