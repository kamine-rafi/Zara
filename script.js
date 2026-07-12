import { API_KEY } from './api.js';

const OWNER_NAME = "KM Rafi Chowdhury";
const chatBox = document.getElementById('chat-box');
const voiceBtn = document.getElementById('voice-btn');

// ১. জারা-র মোড সিলেকশন (Owner vs Public)
let currentMode = 'public'; // ডিফল্ট মোড

function enterMode(mode) {
    if (mode === 'owner') {
        const pin = prompt("Owner PIN প্রবেশ করুন:");
        if (pin === "1234") { // আপনার পিন
            currentMode = 'owner';
            alert("Owner Mode সক্রিয় হয়েছে। স্বাগতম, বস!");
        } else {
            alert("ভুল পিন!");
        }
    } else {
        currentMode = 'public';
        alert("Public Mode সক্রিয় হয়েছে।");
    }
}

// ২. OpenAI API কল ফাংশন
async function getAIResponse(userText) {
    const systemPrompt = currentMode === 'owner' 
        ? `You are Zara, an AI assistant owned by ${OWNER_NAME}. Always address the user as "Boss". Use Bengali and English as needed.` 
        : `You are a helpful AI assistant.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${API_KEY}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userText}
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// ৩. ভয়েস ইনপুট ও আউটপুট
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'bn-BD';

voiceBtn.onclick = () => recognition.start();

recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    chatBox.innerText = "আপনি: " + userText;

    const reply = await getAIResponse(userText);
    
    chatBox.innerText = (currentMode === 'owner' ? "জারা: " : "AI: ") + reply;
    
    // ভয়েস আউটপুট
    const speech = new SpeechSynthesisUtterance(reply);
    speech.lang = 'bn-BD';
    window.speechSynthesis.speak(speech);
};

// গ্লোবাল ফাংশন হিসেবে সেট করা যাতে HTML বাটন থেকে কল করা যায়
window.enterMode = enterMode;
