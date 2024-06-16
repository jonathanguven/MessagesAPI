import sseclient
import requests

def sseConnect(url):
    response = requests.get(url, stream=True)

    response.raise_for_status()

    client = sseclient.SSEClient(response)

    for event in client.events():
        print(f"Message received: {event.data}")

if __name__ == "__main__":
    print("Connecting to the server...")
    sse_url = 'http://localhost:3000/listen?room=general'
    sseConnect(sse_url)
