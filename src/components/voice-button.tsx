'use client';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';
import { useRecordVoice } from './conversation-card';

export const VoiceButton = ({ setInput }: { setInput: (input: string) => void; }) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const { audioBlob, recording, startRecording, stopRecording } = useRecordVoice();

  // Triggers transcription once audioBlob is present
  useEffect(() => {
    if (audioBlob) transcribe();
  }, [audioBlob]);

  const transcribe = async () => {
    setFetching(true);
    const formData = new FormData();
    formData.append('audio_data', audioBlob as Blob, 'file');
    formData.append('type', 'wav');
    formData.append('language', "de");

    // Your server endpoint to upload audio:
    const apiUrl = '/api/conversation/transcribe';

    const response = await fetch(apiUrl, {
      method: 'POST',
      cache: 'no-cache',
      body: formData
    });

    const responseObject = await response.json();

    setInput(responseObject.transcribedText);
    setFetching(false);
  };

  if (recording) return <Button variant="ghost" onClick={stopRecording}>Press to stop</Button>;
  else if (fetching)
    return (
      <Button variant="ghost" isDisabled isLoading>
        Fetching input...
      </Button>
    );
  else return <Button variant="ghost" onClick={startRecording}>Press to speak</Button>;
};
