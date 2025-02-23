# Quick Learn Project

Quick Learn is a modern, AI-powered student productivity platform designed to automate note-taking and enhance learning focus. It provides real-time lecture summarization, key takeaways, important terms, and sample questions using advanced AI technologies like AssemblyAI and Twilio.

## Features
- **Voice Recording**: Capture lectures with crystal-clear audio recording.
- **AI Transcription**: Convert speech to text with high accuracy using AssemblyAI.
- **Smart Summaries**: Get concise summaries of your notes using AI.
- **Easy Sharing**: Share notes with classmates instantly via WhatsApp.
- **Study Planning**: Organize your study schedule effectively.

## Technologies Used
- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: AssemblyAI (for speech-to-text and summarization), Twilio (for WhatsApp integration)
- **Hosting**: Netlify (for frontend deployment)

## Getting Started

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (v16 or higher).
- **AssemblyAI API Key**: Sign up at [AssemblyAI](https://www.assemblyai.com/) and get your API key.
- **Twilio Account**: Sign up at [Twilio](https://www.twilio.com/) and get your Account SID and Auth Token.

### Installation

#### Clone the repository:
```bash
git clone https://github.com/your-username/quick-learn.git
cd quick-learn
```

#### Install dependencies:
```bash
npm install
```

#### Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_ASSEMBLYAI_KEY=your_assemblyai_api_key
REACT_APP_TWILIO_ACCOUNT_SID=your_twilio_account_sid
REACT_APP_TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

#### Start the development server:
```bash
npm start
```

Open your browser and navigate to `http://localhost:3000`.

## Project Structure
```
quick-learn/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── Features.tsx     # Features section
│   │   ├── Hero.tsx         # Hero section
│   │   ├── VoiceRecorder.tsx # Voice recording and summarization
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Entry point
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── README.md                # Project documentation
```

## Key Components

### 1. Hero Section (`Hero.tsx`)
- Displays the main tagline and call-to-action buttons.
- Includes a demo video for user engagement.

### 2. Features Section (`Features.tsx`)
- Highlights the key features of the platform with animations.

### 3. Voice Recorder (`VoiceRecorder.tsx`)
- Allows users to record lectures and generate AI-powered summaries.
- Integrates with AssemblyAI for speech-to-text and summarization.
- Sends summaries to WhatsApp using Twilio.

## How It Works
1. **Record Lecture**: Click the microphone button to start recording.
2. **Generate Summary**: After recording, click "Generate Summary" to get a concise summary of the lecture.
3. **Send to WhatsApp**: Share the summary directly to your WhatsApp number.

## Deployment
### Deploying to Netlify
#### Push your code to GitHub:
```bash
git add .
git commit -m "Deploy to Netlify"
git push origin main
```

#### Deploy on Netlify:
1. Go to [Netlify](https://www.netlify.com/) and create a new site from your GitHub repository.
2. Add environment variables in the Netlify dashboard:
   - `REACT_APP_ASSEMBLYAI_KEY`
   - `REACT_APP_TWILIO_ACCOUNT_SID`
   - `REACT_APP_TWILIO_AUTH_TOKEN`
3. Deploy your site.

## Screenshots
### Hero Section
Hero Section with Call-to-Action

### Voice Recorder
Voice Recorder Interface

### Summary
AI-Generated Summary with WhatsApp Sharing

## Contributing
Contributions are welcome! Follow these steps:

1. **Fork** the repository.
2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Add your feature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request.**

## License
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

## Acknowledgments
- **AssemblyAI**: For providing the speech-to-text and summarization API.
- **Twilio**: For enabling WhatsApp integration.
- **React Community**: For the amazing ecosystem of tools and libraries.

## Contact
For questions or feedback, feel free to reach out:

- **Email**: ynaqirazarizvi8@gmail.com
- **GitHub**: [naqiraza99](https://github.com/naqirraza99)

🚀 Happy Coding!
