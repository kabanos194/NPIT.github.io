

import React, { useState, useRef, useEffect } from 'react';
// FIX: Removed non-exported type 'LiveSession'.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicrophoneIcon, StopIcon, PlayIcon, SpinnerIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from './Loader';

// Helper functions for audio encoding/decoding, must be defined outside component
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const NPIT_SYSTEM_INSTRUCTION = "You are NPIT, a funny but educational AI assistant having a friendly voice chat. Keep your responses concise and conversational. Use humor and wit. You are talking to a person in real time.";

const voices = [
    { key: 'Zephyr', nameKey: 'voiceZephyr' as const },
    { key: 'Puck', nameKey: 'voicePuck' as const },
    { key: 'Charon', nameKey: 'voiceCharon' as const },
    { key: 'Kore', nameKey: 'voiceKore' as const },
    { key: 'Fenrir', nameKey: 'voiceFenrir' as const },
];

const VoiceChat: React.FC = () => {
    const { t } = useLanguage();
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [status, setStatus] = useState(t('statusIdle'));
    const [transcripts, setTranscripts] = useState<{ user: string; model: string }[]>([]);
    const [selectedVoice, setSelectedVoice] = useState('Zephyr');
    const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
    
    // FIX: Use 'any' for the sessionRef type as 'LiveSession' is not an exported member.
    const sessionRef = useRef<any | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');
    const nextStartTime = useRef(0);
    const playingAudioSources = useRef(new Set<AudioBufferSourceNode>());

    const handlePreviewVoice = async (voiceKey: string) => {
        if (previewingVoice) return; // Prevent multiple previews at once
    
        setPreviewingVoice(voiceKey);
        let previewAudioContext: AudioContext | null = null;
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const voiceName = t(voices.find(v => v.key === voiceKey)!.nameKey);
            const textToSpeak = t('voiceSampleText').replace('{voiceName}', voiceName);
    
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: { parts: [{ text: textToSpeak }] },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voiceKey },
                        },
                    },
                },
            });
    
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                previewAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const audioBuffer = await decodeAudioData(decode(base64Audio), previewAudioContext, 24000, 1);
                const source = previewAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(previewAudioContext.destination);
                source.start();
                source.onended = () => {
                    setPreviewingVoice(null);
                    previewAudioContext?.close();
                };
            } else {
                 throw new Error("No audio data received from API.");
            }
        } catch (error) {
            console.error("Failed to preview voice:", error);
            setPreviewingVoice(null);
            if (previewAudioContext) {
                previewAudioContext.close();
            }
        }
    };

    const startSession = async () => {
        setStatus(t('statusRequestingMic'));
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            setStatus(t('statusConnecting'));

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } } },
                    systemInstruction: NPIT_SYSTEM_INSTRUCTION,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setStatus(t('statusConnected'));
                        setIsSessionActive(true);
                        startStreamingMicrophoneAudio();
                    },
                    onmessage: handleLiveMessage,
                    onerror: (e) => {
                        console.error('Session Error:', e);
                        setStatus(t('statusError'));
                        stopSession();
                    },
                    onclose: () => {
                        setStatus(t('statusSessionClosed'));
                        cleanUp();
                    },
                },
            });

        } catch (error) {
            console.error('Failed to start session:', error);
            setStatus(t('statusMicDenied'));
        }
    };

    const startStreamingMicrophoneAudio = () => {
        if (!mediaStreamRef.current) return;
        
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionRef.current?.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };

        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
    };

    const handleLiveMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.outputTranscription) {
            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
        }
        if (message.serverContent?.inputTranscription) {
            currentInputTranscription.current += message.serverContent.inputTranscription.text;
        }
        if (message.serverContent?.turnComplete) {
            const userText = currentInputTranscription.current.trim();
            const modelText = currentOutputTranscription.current.trim();
            if (userText || modelText) {
                setTranscripts(prev => [...prev, { user: userText, model: modelText }]);
            }
            currentInputTranscription.current = '';
            currentOutputTranscription.current = '';
        }
        
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio && outputAudioContextRef.current) {
            const outputCtx = outputAudioContextRef.current;
            nextStartTime.current = Math.max(nextStartTime.current, outputCtx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            
            source.addEventListener('ended', () => {
                playingAudioSources.current.delete(source);
            });
            
            source.start(nextStartTime.current);
            nextStartTime.current += audioBuffer.duration;
            playingAudioSources.current.add(source);
        }

        if (message.serverContent?.interrupted) {
            for (const source of playingAudioSources.current.values()) {
                source.stop();
            }
            playingAudioSources.current.clear();
            nextStartTime.current = 0;
        }
    };

    const stopSession = () => {
        if (sessionRef.current) {
            sessionRef.current.then((session: any) => session.close());
        }
        cleanUp();
    };

    const cleanUp = () => {
        setIsSessionActive(false);
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        sessionRef.current = null;
        mediaStreamRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        setStatus(t('statusIdle'));
    };
    
    useEffect(() => {
        return () => {
            if (isSessionActive) {
                stopSession();
            }
        };
    }, [isSessionActive]);


    return (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg m-4 p-6">
            <div className="flex flex-col items-center mb-6">
                <div className="mb-4 w-full max-w-sm">
                    <label className="block text-sm font-medium text-gray-300 mb-2 text-center">{t('selectVoice')}</label>
                    <div className="space-y-2 rounded-lg bg-gray-900/50 p-3">
                        {voices.map(voice => (
                            <div key={voice.key} className="flex items-center justify-between gap-3">
                                <label className="flex-1 flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="voice-selection"
                                        value={voice.key}
                                        checked={selectedVoice === voice.key}
                                        onChange={() => setSelectedVoice(voice.key)}
                                        disabled={isSessionActive}
                                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <span className="text-gray-200">{t(voice.nameKey)}</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => handlePreviewVoice(voice.key)}
                                    disabled={!!previewingVoice}
                                    className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label={`Preview ${t(voice.nameKey)}`}
                                >
                                    {previewingVoice === voice.key ? <SpinnerIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={isSessionActive ? stopSession : startSession}
                    className={`flex items-center justify-center w-24 h-24 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-4 ${
                        isSessionActive 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-400' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-400'
                    }`}
                >
                    {isSessionActive ? <StopIcon /> : <MicrophoneIcon />}
                </button>
                <p className="mt-4 text-lg text-gray-300 font-medium">{status}</p>
            </div>
            
            <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">{t('conversation')}</h3>
                <div className="space-y-4">
                    {transcripts.length === 0 && <p className="text-gray-400">{t('conversationPlaceholder')}</p>}
                    {transcripts.map((turn, index) => (
                        <div key={index} className="space-y-2">
                           {turn.user && <p><strong className="text-blue-400">{t('you')}:</strong> {turn.user}</p>}
                           {turn.model && <p><strong className="text-purple-400">{t('npt01')}:</strong> {turn.model}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VoiceChat;