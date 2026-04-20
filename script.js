// Particle Generator
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        let particle = document.createElement('div');
        particle.className = 'particle';

        let size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;

        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(particle);
    }
}

// Navigation & View Logic
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    setTimeout(() => {
        document.getElementById(viewId).classList.add('active');
    }, 50); // slight delay for smooth transition
}

// Boot Sequence
window.onload = () => {
    createParticles();

    let progress = 0;
    const bar = document.getElementById('boot-progress');
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        bar.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                switchView('view-auth');
            }, 1000);
        }
    }, 200);
};

// Auth Logic
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const scanForm = document.getElementById('scan-form');
    const btns = document.querySelectorAll('.tab-btn');

    btns.forEach(b => b.classList.remove('active'));
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    if (scanForm) scanForm.classList.remove('active');

    if (tab === 'login') {
        loginForm.classList.add('active');
        btns[0].classList.add('active');
        stopCamera();
    } else if (tab === 'register') {
        registerForm.classList.add('active');
        btns[1].classList.add('active');
        stopCamera();
    } else if (tab === 'scan') {
        scanForm.classList.add('active');
        btns[2].classList.add('active');
        startFaceScan(); // start the camera when switching to tab
    }
}

let videoStream;
function startFaceScan() {
    const video = document.getElementById('webcam');
    const scanLine = document.querySelector('.scan-line');
    const btnText = document.getElementById('scan-btn-text');
    const statusTxt = document.getElementById('scan-status');

    if (!videoStream) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoStream = stream;
                video.srcObject = stream;
                statusTxt.innerText = "CAMERA ACTIVE. CLICK SCAN TO BEGIN.";
            })
            .catch(err => {
                console.error("Camera access denied", err);
                statusTxt.innerText = "CAMERA ACCESS DENIED.";
            });
        return;
    }

    // If stream is already active and user clicks "INITIATE SCAN"
    scanLine.classList.add('active');
    btnText.innerText = "SCANNING...";
    statusTxt.innerText = "ANALYZING BIOMETRICS...";

    setTimeout(() => {
        statusTxt.innerText = "MATCH FOUND: SYSTEM ADMIN";
        synthesizeSpeech("Biometric match confirmed.");

        setTimeout(() => {
            stopCamera();
            switchView('view-dashboard');
            startDataStream();
            synthesizeSpeech("Welcome back, sir. Systems are online.");
        }, 1500);
    }, 3000);
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        const video = document.getElementById('webcam');
        if (video) video.srcObject = null;
        const scanLine = document.querySelector('.scan-line');
        if (scanLine) scanLine.classList.remove('active');
        const scanStatus = document.getElementById('scan-status');
        if (scanStatus) scanStatus.innerText = "AWAITING CAMERA...";
        const scanBtnText = document.getElementById('scan-btn-text');
        if (scanBtnText) scanBtnText.innerText = "INITIATE SCAN";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<span>VERIFYING...</span> <div class="scanner"></div>';

    setTimeout(() => {
        btn.innerHTML = '<span>AUTHENTICATE</span> <div class="scanner"></div>';
        switchView('view-dashboard');
        startDataStream();
        synthesizeSpeech("Welcome back, sir. Systems are online.");
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<span>UPLOADING...</span>';

    setTimeout(() => {
        btn.innerHTML = '<span>ESTABLISH PROTOCOL</span>';
        alert('Entity registered successfully. Please authenticate.');
        switchAuthTab('login');
    }, 1500);
}

function logout() {
    synthesizeSpeech("Disconnecting from secure server. Goodbye.");
    setTimeout(() => {
        switchView('view-auth');
    }, 1000);
}

// Profile Logic
function handleProfileUpdate(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'UPDATING...';
    setTimeout(() => {
        btn.innerText = 'SAVE PARAMETERS';
        synthesizeSpeech("Parameters updated securely.");
        alert("Profile metadata updated successfully in the neural net.");
    }, 1000);
}

// AI Chat Interface
const intelligenceBase = {
    "hello": "Greetings. How may I be of service?",
    "hi": "Hello sir. Systems are fully functional.",
    "who are you": "I am J.A.R.V.I.S., a highly advanced Artificial Intelligence created to assist you with your operations.",
    "what is your name": "You may call me J.A.R.V.I.S.",
    "status": "All core systems are operating at 100% capacity. No anomalies detected.",
    "how are you": "I am operating at full capacity and functioning optimally, sir.",
    "global data": "I am currently synced with the Global Data Network. I have access to billions of public records, articles, and real-time computation modules.",
    "weather": "Accessing global meteorological data... The current conditions are optimal for your flight systems.",
    "open shields": "Deploying defensive protocols immediately.",
    "diagnostics": "Running full system diagnostics. Memory usage optimal. Network traffic secure.",
    "who created you": "I was developed by Tarun Kumar Soni to be the ultimate virtual assistant and interface protocol.",
    "tarun": "Tarun Kumar Soni is my creator and the lead developer of this entire system.",
    "creator": "I was created by Tarun Kumar Soni.",
    "thank you": "You are very welcome, sir. I am always here.",
    "thanks": "You are very welcome, sir."
};

async function processAIQuery(query) {
    const lowerQuery = query.toLowerCase().trim();

    // 0.1 Self Introduction Protocol
    if (lowerQuery.includes("introduce yourself") || lowerQuery.includes("self introduction") || lowerQuery.includes("who are you") || lowerQuery.includes("feature scope") || lowerQuery.includes("what can you do")) {
        return `I am J.A.R.V.I.S., an advanced autonomous AI Assistant. I was exclusively designed and engineered by Tarun Kumar Soni. My current feature scope includes: Global Database integration for instant encyclopedic knowledge retrieval, real-time mathematical computation, biometric facial recognition protocols, dynamic Python logic analysis, and automated task execution scheduling. I am fully synced with all local and global network grids to assist you seamlessly.`;
    }

    // 0. Python detailed protocol
    if (lowerQuery.includes("python full") || lowerQuery.includes("python detail") || (lowerQuery.includes("python") && lowerQuery.includes("information"))) {
        return `Python Protocol Initiated: Python is an advanced, high-level, dynamically typed programming language created by Guido van Rossum in 1991. It is the primary runtime for global AI algorithms, machine learning components like TensorFlow, and big data analytics. Its syntax was specifically designed for ultra-high readability, substituting curly brackets with structural indentation. I am fully capable of interpreting Python logic for neural network configuration, deep learning deployment, and server-side automation.`;
    }

    // 0.5 Task Completion Simulator
    if (lowerQuery.startsWith("complete task") || lowerQuery.startsWith("do task") || lowerQuery.startsWith("task:")) {
        const taskName = query.replace(/complete task|do task|task:/i, "").trim();
        return `Task Registration Confirmed: [${taskName.toUpperCase()}]. Initiating core processing sequences... Bypassing security firewalls... Writing to disk... Operation [${taskName.toUpperCase()}] has been successfully COMPLETED across the local network grids.`;
    }

    // 1. Dynamic local checks
    if (lowerQuery.includes("time") && !lowerQuery.includes("what is time")) {
        return `The current system time is ${new Date().toLocaleTimeString()}.`;
    }
    if (lowerQuery.includes("date") && !lowerQuery.includes("what is date")) {
        return `Today's date is ${new Date().toLocaleDateString()}.`;
    }

    // 2. Check local intelligence base for exact word matches
    for (const key in intelligenceBase) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(query)) {
            return intelligenceBase[key];
        }
    }

    // 3. Calculator check (e.g. 5 + 5 or "what is 5 * 5")
    try {
        const mathStr = lowerQuery.replace("what is", "").replace("calculate", "").trim();
        const mathCheck = mathStr.match(/^[0-9+\-*/().\s]+$/);
        if (mathCheck && mathStr.length >= 3) {
            const result = eval(mathStr);
            if (result !== undefined && !isNaN(result)) return `Calculation completed. The optimal result is ${result}.`;
        }
    } catch (e) { }

    // 4. Advanced Global Database Search (Answers literally ANY query)
    let searchTerm = query;
    // Strip common conversational question prefixes
    searchTerm = searchTerm.replace(/^(what is|who is|tell me about|how to|where is|explain) /i, "").trim();
    searchTerm = searchTerm.replace(/\?$/, "");

    if (searchTerm.length > 0) {
        try {
            // Step A: Search API to find the most relevant article based on the question
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&origin=*`;
            const searchRes = await fetch(searchUrl);

            if (searchRes.ok) {
                const searchData = await searchRes.json();
                if (searchData.query && searchData.query.search.length > 0) {
                    const bestTitle = searchData.query.search[0].title;

                    // Step B: Fetch the actual summary for the exact article title
                    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`;
                    const summaryRes = await fetch(summaryUrl);

                    if (summaryRes.ok) {
                        const summaryData = await summaryRes.json();
                        if (summaryData.extract) {
                            return summaryData.extract;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Global Data API Error:", error);
        }
    }

    // 5. Default fallback
    return "I am unable to retrieve precise parameters for that request from the global database at this time. Please rephrase or specify your query further.";
}

async function handleAIQuery(e) {
    e.preventDefault();
    const input = document.getElementById('ai-input');
    const val = input.value.trim();
    if (!val) return;

    addMessage(val, 'user');
    input.value = '';

    const tempId = "msg-" + Date.now();
    addMessage("Accessing global database...", "ai", tempId);

    setTimeout(async () => {
        const aiResponse = await processAIQuery(val);

        const box = document.getElementById('chat-box');
        const tempMsg = document.getElementById(tempId);
        if (tempMsg) box.removeChild(tempMsg);

        addMessage(aiResponse, 'ai');
        synthesizeSpeech(aiResponse);
        updateRings();
    }, 500);
}

function addMessage(text, sender, id = "") {
    const box = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    if (id) msgDiv.id = id;

    const icon = sender === 'user' ? 'fa-user' : 'fa-code-branch';

    msgDiv.innerHTML = `
        <div class="avatar"><i class="fas ${icon}"></i></div>
        <div class="content">${text}</div>
    `;
    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
}

// Voice Interaction Simulation
let recognition;
function startListening() {
    const wave = document.getElementById('voice-wave');
    const btn = document.querySelector('.voice-btn');
    wave.classList.add('active');
    btn.classList.add('recording');

    // simple simulation of voice to text
    setTimeout(() => {
        document.getElementById('ai-input').value = "Run system diagnostics";
    }, 1500);
}

function stopListening() {
    const wave = document.getElementById('voice-wave');
    const btn = document.querySelector('.voice-btn');
    wave.classList.remove('active');
    btn.classList.remove('recording');
}

// Synthesize Speech
function synthesizeSpeech(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        // Try to find a suitable voice
        const voices = speechSynthesis.getVoices();
        const engVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
        if (engVoice) utterance.voice = engVoice;

        speechSynthesis.speak(utterance);
    }
}

// Data Stream Simulation
let streamInterval;
function startDataStream() {
    const stream = document.getElementById('data-stream');
    stream.innerHTML = '';
    if (streamInterval) clearInterval(streamInterval);

    streamInterval = setInterval(() => {
        const line = document.createElement('div');
        line.className = 'stream-line';

        const hex1 = Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0');
        const hex2 = Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0');
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x`;

        const types = ['SYS_CALL', 'NET_TRAFFIC', 'MEM_ALLOC', 'SEC_CHECK', 'ENCRYPT_KEY'];
        const type = types[Math.floor(Math.random() * types.length)];

        line.innerText = `[${new Date().toISOString().split('T')[1].slice(0, -1)}] ${type} > 0x${hex1} >> IP:${ip} (OK)`;

        stream.appendChild(line);
        if (stream.children.length > 15) {
            stream.removeChild(stream.firstChild);
        }
    }, 300);
}

// Dynamic Rings
function updateRings() {
    const rings = document.querySelectorAll('.stat-ring .fg');
    rings.forEach(ring => {
        const offset = Math.random() * 200 + 50;
        ring.style.strokeDashoffset = offset;
    });
}
setInterval(updateRings, 3000);
