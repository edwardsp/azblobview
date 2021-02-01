import json
import time
from flask import Flask, request
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__

app = Flask(__name__, static_folder='../build', static_url_path='/')

def load_config():
    with open("../storage.json") as f:
        return json.load(f)
    print("Error: cannot find storage.json (create in the root with the container details you want to access)")
    sys.exit(1)

containers = load_config()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/containers', methods = ['GET'])
def get_containers():
    return { 'containers': [ {"name": k} for k in containers.keys() ] }

@app.route('/api/containers/<container_name>', methods = ['GET'])
def get_container(container_name):
    container_client = ContainerClient.from_connection_string(
        containers[container_name]["connect_str"], 
        container_name=containers[container_name]["name"]
    )
    blob_list = container_client.list_blobs(include="metadata")
    blobs = []
    for blob in blob_list:
        b = {
            "name": blob.name,
            "size": blob.size,
            "last_modified": blob.last_modified
        }
        if blob.metadata:
            for k in blob.metadata.keys():
                b[k] = blob.metadata[k]
        blobs.append(b)
    return { 'blobs': blobs }
