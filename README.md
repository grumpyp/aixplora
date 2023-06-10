# AIxplora - Your AI powered personal file explorer
<p align="center">
  <img src="aixplora_logo.png" width="350" title="AIxplora logo"><br>
<a href="https://discord.com/invite/M2AuGZvgHq">
  <img src="https://img.shields.io/badge/discord-join%20chat-blue.svg" alt="Join our Discord" height="40"></a>
</p>

AIxplora is your new personal assistant, an open-source project that opens up unlimited possibilities.
It leverages AI and LLMs to understand all types of documents, unrestricted by their length or format.

**Imagine being able to query PDF files, MP3 audio, videos, and other types of documents with equal ease and proficiency. 
Yes, that's the limitless world AIxplora is inviting you into!***


## How Can You Contribute?
There are several ways you can contribute as I just released a PoC of the project:

- Code: Write, refactor, optimize - every line of code matters!

- Documentation: Help us make our project more understandable and user-friendly.

- Testing: Every bug found is a step towards perfection.

- Suggest Features: We believe in the power of ideas, no matter where they come from.

- Spread the Word: Share our project within your networks. The more people know about AIxplora, the better it can become!

## Demo and introduction videos
https://youtu.be/2lNNKLM0o7U
https://youtu.be/eKLmhJobVvc


## How to run locally

### 1. Clone the repo and Install dependencies
```
git clone git@github.com:grumpyp/aixplora.git
```
### 2. Install dependencies
```
pip install -r backend/requirements.txt
npm install frontend
```
### 3. Run the backend and the frontend
```
python backend/main.py
cd frontend
npm start
```

## How to run using Docker Compose

### 1. Clone the repo and Install dependencies
```
git clone git@github.com:grumpyp/aixplora.git
```
### 2. Build Docker image and run containers
```
docker compose up --build
```
### 3. When running the above command for the first time, make sure `frontend/node_modules` folder does not exist. The initial build might take some time since it will install the the required dependencies.

### 4. Once the build and the package installation is finished, it should show an error in the console `The SUID sandbox helper binary was found...` (We'll work on that to fix it).
### 5. Navigate to the UI on `http://localhost:1212/`. It will also show an error `Cannot read properties of undefined (reading 'ipcRenderer')`. Close the error clicking the close button at the bottom of the screen, and you're good to go!
### 6. Next time when starting the app you can simply use the following command
```
docker compose up
```

- **Note that** 
  - After adding new packages in Frontend in `package.json` file, you'll need to remove `node_modules` folder and then run `docker compose up`
  - After adding new packages in `requirements.txt` you'll have to run `docker compose up --build`


## Roadmap

- Build a community around the project
- Release a standalone desktop app
- Bugfixes and improvements to scale the project
- Add more features (custom LLMs, more file types, etc.)
- Cloud deployment
- Integrations (Google Drive, Dropbox, etc.)

[![Star History Chart](https://api.star-history.com/svg?repos=grumpyp/aixplora&type=Date)](https://star-history.com/#grumpyp/aixplora&Date)

