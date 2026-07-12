import { API_KEY } from './api.js';

// ৩ সেকেন্ড পর অ্যাপ দেখাবে
setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}, 3000);

// ভয়েস লজিক
const voiceBtn = document.getElementById('voice-btn');
const chatBox = document.getElementById('chat-box');

voiceBtn.onclick = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'bn-BD';
    recognition.start();

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        chatBox.innerText = "আপনি: " + text;

        // API কল
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: text}]
                })
            });
            const data = await response.json();
            chatBox.innerText = "জারা: " + data.choices[0].message.content;
        } catch (e) {
            chatBox.innerText = "এরর হয়েছে। API Key চেক করুন।";
        }
    };
};
