//use web speech api to record audio from user
import React, { useState, useEffect } from 'react';

const Record = () => {
    const [recording, setRecording] = useState(false);
    
    //use web speech api to record audio from user
    const [transcript, setTranscript] = useState('');
    // start recording instance
    const startRecording = () => {
        setRecording(true);
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event) => {
            const interimTranscript = [...event.results]
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');
            setTranscript(interimTranscript);
        };
    }

export default Record;