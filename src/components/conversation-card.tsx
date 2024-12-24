"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { ConversationTextResponseType } from "@/lib/types";

export const useRecordVoice = () => {
  // State to hold the media recorder instance
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

  // State to track whether recording is currently in progress
  const [recording, setRecording] = useState(false);
  // Ref to store audio chunks during recording
  const chunks = useRef<Array<Blob>>([]);
  const [audioBlob, setAudioBlob] = useState<Blob>();

  // Function to start the recording
  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };

  // Function to stop the recording

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Function to initialize the media recorder with the provided stream
  const initialMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    // Event handler when recording starts
    mediaRecorder.onstart = () => {
      chunks.current = []; // Resetting chunks array
    };

    // Event handler when data becomes available during recording
    mediaRecorder.ondataavailable = (ev: BlobEvent) => {
      chunks.current.push(ev.data); // Storing data chunks
    };

    // Event handler when recording stops
    mediaRecorder.onstop = () => {
      // Creating a blob from accumulated audio chunks with WAV format
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      console.log(audioBlob, "audioBlob");
      // getTranscript(audioBlob)

      setAudioBlob(audioBlob);

      // You can do something with the audioBlob, like sending it to a server or processing it further
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return { recording, audioBlob, startRecording, stopRecording };
};

const useBufferPlayer = () => {
  // const [audioSource, setAudioSource] = useState<AudioBufferSourceNode>()
  const [audioCtx, setAudioCtx] = useState<AudioContext>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioCtx = new window.AudioContext();
      setAudioCtx(audioCtx);
    }
  }, []);

  const playBuffer = async (buffer: ArrayBuffer) => {
    if (audioCtx) {
      const source = audioCtx.createBufferSource();
      const decodedData = await audioCtx.decodeAudioData(buffer);
      source.buffer = decodedData;
      source.connect(audioCtx.destination);

      source.start();
    } else {
      alert("Encountered a problem playing audio! Refresh??");
      throw Error("Problem playing audio");
    }
  };

  return { playBuffer };
};

const AnswerSkeleton = () => (
  <div className="flex flex-col m-5">
    <Skeleton className="w-full h-28 rounded-lg"></Skeleton>
  </div>
);

const Answer = ({ answer }: { answer: ConversationTextResponseType }) => (
  <div className="flex flex-col m-5">
    <p className="mb-5">Du sagt: {answer.inputText}</p>
    <p className="mb-5">Ich sagt: {answer.answer}</p>
    {answer.correction ? (
      <p className="whitespace-pre-wrap">
        <b>Explanation:</b> {answer.correction}
      </p>
    ) : null}
  </div>
);

export default function ConversationCard() {
  const { audioBlob, recording, startRecording, stopRecording } =
    useRecordVoice();
  const { playBuffer } = useBufferPlayer();
  const [waitingForTranscription, setWaitingForTranscription] = useState(false);
  const [textResponse, setTextResponse] =
    useState<ConversationTextResponseType>();

  useEffect(() => {
    if (audioBlob) transcribe();
  }, [audioBlob]);

  const transcribe = async () => {
    setWaitingForTranscription(true);
    console.log(audioBlob);

    const formData = new FormData();
    formData.append("audio_data", audioBlob as Blob, "file");
    formData.append("type", "wav");

    // Your server endpoint to upload audio:
    const apiUrl = "/api/conversation/stt";

    const response = await fetch(apiUrl, {
      method: "POST",
      cache: "no-cache",
      body: formData,
    });

    const responseObject = await response.json();

    const audioBuffer: ArrayBuffer = new Uint8Array(
      responseObject.audioResponse.data
    ).buffer;

    await playBuffer(audioBuffer);
    setWaitingForTranscription(false);
    setTextResponse(responseObject.textResponse);
  };

  const Controls = () => {
    if (!recording && !waitingForTranscription)
      return <Button onClick={startRecording}>Press to speak</Button>;
    else if (recording)
      return <Button onClick={stopRecording}>Press to stop speaking</Button>;
    else
      return (
        <Button isDisabled isLoading>
          Cancel Transcription
        </Button>
      );
  };

  const getAnswerComponent = () => {
    if (waitingForTranscription) return <AnswerSkeleton />;
    else if (textResponse) return <Answer answer={textResponse} />;
    else return null;
  };

  return (
    <Card className={`p-5 m-5`}>
      <CardBody className="">
        {getAnswerComponent()}
        <Controls />
      </CardBody>
    </Card>
  );
}
