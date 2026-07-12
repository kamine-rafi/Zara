const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'bn-BD';

startBtn.addEventListener('click', () => {
    recognition.start();
    document.getElementById('status').innerText = "জারা শুনছে...";
});

recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    output.innerText = "আপনি বলেছেন: " + command;
    
    if (command.includes('হ্যালো জারা')) {
        speak("জি বস, আমি শুনতে পাচ্ছি। বলুন কী করতে হবে?");
    }
};

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'bn-BD';
    window.speechSynthesis.speak(speech);
}
