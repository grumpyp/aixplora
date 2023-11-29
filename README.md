# AIxplora - Your AI powered personal file explorer
<p align="center">
  <img src="aixplora_logo.png" width="350" title="AIxplora logo"><br>
<a href="https://discord.com/invite/M2AuGZvgHq">
  <img src="https://img.shields.io/badge/discord-join%20chat-blue.svg" alt="Join our Discord" height="40"></a>
</p>
<hr>

## 🖥️ Now available for download 🖥️!

[🖥 Windows version](https://we.tl/t-3GIdXFcojo)

[🖥 Mac version (coming soon)](#)

<hr>

AIxplora is your new personal assistant, an open-source project that opens up unlimited possibilities.
It leverages AI and LLMs to understand all types of documents, unrestricted by their length or format.

**Imagine being able to query PDF files, MP3 audio, videos, and other types of documents with equal ease and proficiency. 
Yes, that's the limitless world AIxplora is inviting you into!**

## 🚀 Highlighted Features

- **Universal File Integration**: Accepts any file type without restrictions on length.
- **Open-Source Transparency**: Complete access to the source code, granting unparalleled flexibility and trust.
- **Flexible Privacy Options**:
  - Use official OpenAI and ChatGPT models while ensuring data confidentiality.
  - **Option to utilize open-source models for an added layer of privacy. (Everything will run on your machine, no third party API usage)**
- **Innovative Summarization**: Harness a unique approach to transform your files into concise summaries.
- **Interactive File Indexing**: Engage in dynamic conversations with your indexed files, or detach the "AIxplora brain"-interface for a pure ChatGPT experience.

## 💡 Roadmap

- **AIxplora-Cloud**: Share your knowledge seamlessly, perfect for businesses, friends, or families aiming for collaborative learning.
- **AIxplora Integration**: Embed your AIxplora brain as a Chat-widget on your website, enabling instant AI-backed responses to user queries.
- **AIxplora Executable**: Simplified usage for all; install AIxplora just like any standard application, no technical expertise needed.
- **Stay Tuned!**: More exciting updates are on the horizon.

## 🎥 Demo video

https://github.com/grumpyp/aixplora/assets/75830792/7302684f-2c1f-4849-9f10-c6254be1009d



more videos on YouTube:

https://youtu.be/8x9HhWjjNtY
https://youtu.be/2lNNKLM0o7U
https://youtu.be/eKLmhJobVvc


## 🛠 How to Run Locally

1. **Clone the Repository & Install Dependencies**
    ```
    git clone git@github.com:grumpyp/aixplora.git
    ```

2. **Install Dependencies**
    ```
    pip install -r backend/requirements.txt
    cd frontend && npm install
    cd ..
    ```

3. **Launch the Backend & Frontend**
    ```
    python backend/main.py
    cd frontend
    npm start
    ```

🔍 **Troubleshooting**: Encountering frontend installation problems? Consult this [debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400).

## 🐳 How to Run using Docker Compose

1. **Clone the Repository**
    ```
    git clone git@github.com:grumpyp/aixplora.git
    ```

2. **Build Docker Image & Spin Up Containers**
    ```
    install=true docker compose up --build
    ```

3. **Initial Build**
    - Ensure the `frontend/node_modules` folder is absent on the first command execution.
    - The initial building process might be prolonged due to dependency installation.

4. **Post-Build Notification**
    - After the build and package installation concludes, an error might appear in the console: `app exited with code null, waiting for change to restart it`. This is a known issue we're addressing.

5. **Access the UI**
    - Visit `http://localhost:1212/`.

6. **Subsequent Launches**
    ```
    docker compose up
    ```
    📝 **Notes**:
    - After appending new packages in `requirements.txt`, execute `docker compose up --build`.
    - Post adding fresh packages in `package.json`, use `install=true docker compose up` for new package installations.
    - To solely launch the frontend: `docker compose up frontend`.
    - To solely launch the backend: `docker compose up backend`.



## 🤝 How Can You Contribute?

With the recent release of a PoC for the project, your involvement is pivotal. Here's how you can be a part of our journey:

- **Code**: Dive deep into our codebase! Whether it's writing, refactoring, or optimizing, every line contributes to our collective vision.
  
- **Documentation**: Illuminate our project's essence. Assist in crafting clearer and more user-centric guidelines and explanations.
  
- **Testing**: Become our frontline in quality assurance. Each bug identified is a stride towards unparalleled product excellence.
  
- **Suggest Features**: Your imagination is our canvas. We deeply value ideas, irrespective of their origin.
  
- **Spread the Word**: Amplify our message. Introduce AIxplora to your network and watch it evolve and flourish with increased collective insight.

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=grumpyp/aixplora&type=Date)](https://star-history.com/#grumpyp/aixplora&Date)

