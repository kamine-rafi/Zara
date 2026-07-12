const API_KEY = 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
const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'bn-BD';

startBtn.addEventListener('click', () => {
    recognition.start();
    document.getElementById('status').innerText = "জারা শুনছে...";
});

recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    output.innerText = "আপনি: " + userText;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: userText }]
            })
        });

        const data = await response.json();
        const zaraResponse = data.choices[0].message.content;

        output.innerText = "জারা: " + zaraResponse;
        speak(zaraResponse);
    } catch (error) {
        output.innerText = "দুঃখিত, কোনো সমস্যা হয়েছে।";
    }
};

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'bn-BD';
    window.speechSynthesis.speak(speech);
}
