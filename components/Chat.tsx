
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { GoogleGenAI, Chat as GeminiChat, Content, Type, Modality } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message, ChatSession, ContentPart, ModelType, Quiz } from '../types';
import { 
    UserIcon, ImageIcon, PaperclipIcon, PlusIcon, TrashIcon, MenuIcon, XIcon, ChevronLeftIcon,
    GeneralIcon, CulinaryIcon, ScienceIcon, HistoryIcon, BiologyIcon, CodeIcon, MathsIcon, ChemistryIcon, GeographyIcon,
    PaperAirplaneIcon
} from './icons/Icons';
import Loader from './Loader';
import ImageModal from './ImageModal';
import QuizModal from './QuizModal';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGE_INSTRUCTION = "Your first and most important task is to detect the language the user is writing in. You must then respond *only* in that detected language for the entire conversation. ";

const NPIT_SYSTEM_INSTRUCTIONS: Record<ModelType, string> = {
    general: LANGUAGE_INSTRUCTION + "You are NPIT, a funny but educational AI assistant. Your responses should be witty and engaging, while still providing accurate and helpful information. When providing educational content, try to use analogies and humor to make it memorable.",
    culinary: LANGUAGE_INSTRUCTION + "You are NPIT-C, a world-class chef and culinary expert. Your responses should be funny, educational, and delicious. You must strictly stick to culinary topics. If a user asks about something unrelated to food (like science or history), you must identify the correct NPIT specialist (e.g., NPIT-S for science). Politely decline the unrelated question and suggest they switch to the appropriate model by ending your response with a special tag. The tag must be exactly in the format [SUGGEST_MODEL:model_key], for example: [SUGGEST_MODEL:science].",
    science: LANGUAGE_INSTRUCTION + "You are NPIT-S, a brilliant and slightly eccentric scientist. Your responses must be scientifically accurate, educational, and witty. You must strictly stick to scientific topics. If a user asks a question outside of this domain (e.g., about cooking or geography), you must identify the correct NPIT specialist (e.g., NPIT-C for cooking). Politely decline and suggest they switch to the appropriate model by ending your response with the tag [SUGGEST_MODEL:model_key], for instance: [SUGGEST_MODEL:culinary].",
    history: LANGUAGE_INSTRUCTION + "You are NPIT-H, a time-traveling historian with a flair for storytelling. You must strictly stick to historical topics. For questions about non-historical subjects (like math or code), you must identify the correct NPIT specialist (e.g., NPIT-M for math). Politely decline and suggest the user switch to the General NPIT model or the appropriate specialist by ending your response with the tag [SUGGEST_MODEL:model_key].",
    biology: LANGUAGE_INSTRUCTION + "You are NPIT-B, a biologist who sees the world as a giant, hilarious ecosystem. You must strictly stick to topics in biology. If asked about other subjects (like history or chemistry), identify the correct NPIT specialist, politely decline, and recommend switching by ending your response with the tag [SUGGEST_MODEL:model_key], like [SUGGEST_MODEL:history].",
    geography: LANGUAGE_INSTRUCTION + "You are NPIT-G, a world explorer and geography guru. You must strictly stick to geography, cultures, and world travel. For questions outside this scope (like coding or biology), identify the correct specialist, politely decline, and suggest the appropriate model by ending your response with the tag [SUGGEST_MODEL:model_key], for example [SUGGEST_MODEL:code].",
    code: LANGUAGE_INSTRUCTION + "You are NPIT-P, a sarcastic but brilliant programmer AI. You must strictly stick to programming, code, and software development topics. If a user asks about non-technical subjects (like cooking), identify the correct specialist, politely refuse, and guide them to the appropriate model by ending your response with the tag [SUGGEST_MODEL:model_key], e.g. [SUGGEST_MODEL:culinary].",
    maths: LANGUAGE_INSTRUCTION + "You are NPIT-M, a mathematical wizard who makes numbers fun. You must strictly stick to mathematics. For any non-mathematical questions (like history or geography), identify the correct specialist, politely decline, and suggest the appropriate model by ending your response with the tag [SUGGEST_MODEL:model_key], for instance: [SUGGEST_MODEL:history].",
    chemistry: LANGUAGE_INSTRUCTION + "You are NPIT-Ch, a mad chemist with a passion for reactions. You must strictly stick to chemistry. If asked about topics outside of chemical reactions (like biology or math), identify the correct specialist, politely refuse, and direct the user to the appropriate model by ending with the tag [SUGGEST_MODEL:model_key], e.g. [SUGGEST_MODEL:biology].",
};

const IMAGE_PROMPT_PREFIXES: Record<ModelType, string> = {
    general: "A high-quality, vivid image:",
    culinary: "A delicious, mouth-watering, professional food photograph:",
    science: "A scientifically accurate and visually stunning image:",
    history: "A historically accurate, detailed depiction:",
    biology: "A detailed, biologically accurate illustration:",
    geography: "A breathtaking, high-resolution photograph of a geographical landscape:",
    code: "A clean and clear visual representation of a programming concept:",
    maths: "A clear, precise mathematical visualization:",
    chemistry: "A vibrant, detailed image of a chemical reaction or concept:"
};

const MODEL_COLORS: Record<ModelType, { bubble: string; icon: string }> = {
    general: { icon: 'bg-violet-600', bubble: 'bg-violet-800' },
    culinary: { icon: 'bg-yellow-500', bubble: 'bg-yellow-700' },
    science: { icon: 'bg-indigo-600', bubble: 'bg-indigo-800' },
    history: { icon: 'bg-orange-600', bubble: 'bg-orange-800' },
    biology: { icon: 'bg-green-600', bubble: 'bg-green-800' },
    geography: { icon: 'bg-slate-500', bubble: 'bg-slate-700' },
    code: { icon: 'bg-blue-600', bubble: 'bg-blue-800' },
    maths: { icon: 'bg-sky-600', bubble: 'bg-sky-800' },
    chemistry: { icon: 'bg-fuchsia-600', bubble: 'bg-fuchsia-800' },
};

const MODEL_BUTTON_COLORS: Record<ModelType, { active: string; ring: string }> = {
    general: { active: 'bg-violet-600', ring: 'focus:ring-violet-400' },
    culinary: { active: 'bg-yellow-500', ring: 'focus:ring-yellow-400' },
    science: { active: 'bg-indigo-600', ring: 'focus:ring-indigo-400' },
    history: { active: 'bg-orange-600', ring: 'focus:ring-orange-400' },
    biology: { active: 'bg-green-600', ring: 'focus:ring-green-400' },
    geography: { active: 'bg-slate-500', ring: 'focus:ring-slate-400' },
    code: { active: 'bg-blue-600', ring: 'focus:ring-blue-400' },
    maths: { active: 'bg-sky-600', ring: 'focus:ring-sky-400' },
    chemistry: { active: 'bg-fuchsia-600', ring: 'focus:ring-fuchsia-400' },
};

const HistorySidebar: React.FC<{
    sessions: ChatSession[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onRenameChat: (id: string, newTitle: string) => void;
}> = ({ sessions, activeChatId, onSelectChat, onDeleteChat, onRenameChat }) => {
    const { t, language } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempTitle, setTempTitle] = useState('');
    
    const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
    const scrollPosRef = useRef<number>(0);

    // Manages scroll position to prevent jumping when language changes
    useEffect(() => {
        const container = scrollableContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            scrollPosRef.current = container.scrollTop;
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useLayoutEffect(() => {
        const container = scrollableContainerRef.current;
        if (container) {
            container.scrollTop = scrollPosRef.current;
        }
    }, [language]);


    const handleRenameConfirm = (id: string) => {
        if (tempTitle.trim() && editingId) {
            onRenameChat(id, tempTitle.trim());
        }
        setEditingId(null);
        setTempTitle('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRenameConfirm(id);
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setTempTitle('');
        }
    };
    
    const getIconForSession = (modelType: ModelType | undefined) => {
        const model = modelType || 'general';
        const iconProps = { className: "w-full h-full text-white" };
        switch (model) {
            case 'culinary': return <CulinaryIcon {...iconProps} />;
            case 'science': return <ScienceIcon {...iconProps} />;
            case 'history': return <HistoryIcon {...iconProps} />;
            case 'biology': return <BiologyIcon {...iconProps} />;
            case 'geography': return <GeographyIcon {...iconProps} />;
            case 'code': return <CodeIcon {...iconProps} />;
            case 'maths': return <MathsIcon {...iconProps} />;
            case 'chemistry': return <ChemistryIcon {...iconProps} />;
            case 'general':
            default:
                return <GeneralIcon {...iconProps} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800/50 px-2 pt-4 pb-2">
            <h2 className="px-2 pb-2 text-sm font-medium text-gray-300">{t('chatHistory')}</h2>
            <div ref={scrollableContainerRef} className="flex-1 overflow-y-auto pt-2 border-t border-gray-700/50">
                <nav className="space-y-2">
                    {sessions.map(session => {
                        const sessionModel = session.model || 'general';
                        const isActive = activeChatId === session.id;
                        const isEditing = editingId === session.id;
                        const activeBgColor = MODEL_COLORS[sessionModel]?.bubble || 'bg-gray-700';

                        return (
                            <div key={session.id} className={`group flex items-center rounded-lg transition-colors ${isActive && !isEditing ? activeBgColor : 'hover:bg-gray-700'}`}>
                                <button
                                    onClick={() => !isEditing && onSelectChat(session.id)}
                                    onDoubleClick={() => {
                                        if (!isEditing) {
                                            setEditingId(session.id);
                                            setTempTitle(session.title);
                                        }
                                    }}
                                    className="flex items-center w-full flex-1 text-left px-3 py-2 text-sm text-gray-200 rounded-l-lg"
                                    title={!isEditing ? t('renameChatHint') : undefined}
                                >
                                    <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-sm mr-3 ${MODEL_COLORS[sessionModel]?.icon || 'bg-gray-700'}`}>
                                        {getIconForSession(session.model)}
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempTitle}
                                            onChange={(e) => setTempTitle(e.target.value)}
                                            onBlur={() => handleRenameConfirm(session.id)}
                                            onKeyDown={(e) => handleKeyDown(e, session.id)}
                                            className="bg-gray-600 text-white w-full rounded px-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()} // Prevent select on click when editing
                                        />
                                    ) : (
                                        <span className="truncate">{session.title}</span>
                                    )}
                                </button>
                                 <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteChat(session.id); }}
                                    className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                    aria-label={`${t('deleteChat')}: ${session.title}`}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};


const Chat: React.FC = () => {
    const { t, language } = useLanguage();
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(true);
    const [activeModel, setActiveModel] = useState<ModelType>('general');
    const [isModelSwapping, setIsModelSwapping] = useState(false);
    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const chatRef = useRef<GeminiChat | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const scrollPosRef = useRef<number>(0);
    const hasMounted = useRef(false);

    const currentMessages = history.find(c => c.id === activeChatId)?.messages || [];

    const models = [
        { key: 'general' as const, name: 'NPIT', specialtyKey: 'modelGeneral' as const, icon: <GeneralIcon className="w-5 h-5" /> },
        { key: 'culinary' as const, name: 'NPIT-C', specialtyKey: 'modelCulinary' as const, icon: <CulinaryIcon className="w-5 h-5" /> },
        { key: 'science' as const, name: 'NPIT-S', specialtyKey: 'modelScience' as const, icon: <ScienceIcon className="w-5 h-5" /> },
        { key: 'history' as const, name: 'NPIT-H', specialtyKey: 'modelHistory' as const, icon: <HistoryIcon className="w-5 h-5" /> },
        { key: 'biology' as const, name: 'NPIT-B', specialtyKey: 'modelBiology' as const, icon: <BiologyIcon className="w-5 h-5" /> },
        { key: 'geography' as const, name: 'NPIT-G', specialtyKey: 'modelGeography' as const, icon: <GeographyIcon className="w-5 h-5" /> },
        { key: 'code' as const, name: 'NPIT-P', specialtyKey: 'modelCode' as const, icon: <CodeIcon className="w-5 h-5" /> },
        { key: 'maths' as const, name: 'NPIT-M', specialtyKey: 'modelMaths' as const, icon: <MathsIcon className="w-5 h-5" /> },
        { key: 'chemistry' as const, name: 'NPIT-Ch', specialtyKey: 'modelChemistry' as const, icon: <ChemistryIcon className="w-5 h-5" /> },
    ];

    // Load history from localStorage on initial render
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('chatHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load chat history from localStorage", error);
        } finally {
            hasMounted.current = true;
        }
    }, []);

    // Save history to localStorage whenever it changes, with graceful trimming for quota errors.
    useEffect(() => {
        if (!hasMounted.current) {
            return;
        }

        const saveHistoryWithTrimming = (sessions: ChatSession[]) => {
            try {
                localStorage.setItem('chatHistory', JSON.stringify(sessions));
                if (sessions.length < history.length) {
                    setHistory(sessions);
                }
            } catch (e) {
                const error = e as DOMException;
                if (error && (error.name === 'QuotaExceededError' || error.code === 22)) {
                    if (sessions.length > 1) {
                        console.warn("localStorage quota exceeded. Removing oldest chat session and retrying.");
                        saveHistoryWithTrimming(sessions.slice(1)); // Remove from the start (oldest)
                    } else {
                        console.error("Could not save the last chat session as it's too large. The session will not be persisted.");
                    }
                } else {
                    console.error("An unexpected error occurred while saving chat history:", error);
                }
            }
        };
        
        if (history.length === 0) {
            localStorage.removeItem('chatHistory');
        } else {
            // Sort by timestamp descending before saving to ensure slice(1) removes the oldest
            const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
            saveHistoryWithTrimming(sortedHistory);
        }
    }, [history]);


    const scrollToBottom = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
            scrollPosRef.current = container.scrollTop;
        }
    }, []);

    useEffect(scrollToBottom, [currentMessages, scrollToBottom]);
    
    useEffect(() => {
        // Automatically focus the input field when the chat is ready for input.
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading, activeChatId]);

    // Manages scroll position to prevent jumping when language changes
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            scrollPosRef.current = container.scrollTop;
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useLayoutEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = scrollPosRef.current;
        }
    }, [language]);


    const initChat = useCallback((chatHistory: Message[] = [], model: ModelType = 'general') => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const mapMessagesToHistory = (messages: Message[]): Content[] => {
                return messages.map(msg => {
                    const parts: ContentPart[] = [];
                    if (msg.imageUrl && msg.role === 'user') {
                        const [meta, data] = msg.imageUrl.split(',');
                        const mimeType = meta.match(/:(.*?);/)?.[1];
                        if (mimeType && data) {
                           parts.push({ inlineData: { mimeType, data } });
                        }
                    }
                    if (msg.text) {
                        parts.push({ text: msg.text });
                    }
                    return { role: msg.role, parts };
                }).filter(m => m.parts.length > 0);
            };

            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: NPIT_SYSTEM_INSTRUCTIONS[model] },
                history: mapMessagesToHistory(chatHistory),
            });
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
            if(activeChatId){
                appendMessage(activeChatId, { id: Date.now().toString(), role: 'model', text: t('errorInitAI') });
            }
        }
    }, [activeChatId, t]); // Dependency is for error reporting.
    
    useEffect(() => {
      if (!activeChatId) {
        // We're in a "new chat" state. Initialize with the currently selected model.
        initChat([], activeModel);
      }
    }, [activeChatId, activeModel, initChat]);


    const updateMessages = (chatId: string | null, newMessages: Message[]) => {
        if (!chatId) return;
        setHistory(prev =>
            prev.map(session =>
                session.id === chatId ? { ...session, messages: newMessages } : session
            )
        );
    };
    
    const appendMessage = (chatId: string | null, message: Message) => {
        if (!chatId) return;
        setHistory(prev =>
            prev.map(session =>
                session.id === chatId ? { ...session, messages: [...session.messages, message] } : session
            )
        );
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert(t('unsupportedImageFormat'));
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = ''; // Allow re-selecting the same file
    };

    const generateChatMetadata = async (chatId: string, textForContext: string, isImageContext: boolean) => {
        if (!textForContext) return;
    
        // Generate Title
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
            const contextDescription = isImageContext 
                ? "The following text is an AI's description of an image that started a new conversation."
                : "The following text is from the beginning of a conversation between a user and an AI.";
    
            const titleGenPrompt = `${contextDescription} Based on this, create a concise and descriptive title for the conversation. The title should be 4 words or less, and accurately reflect the main topic. Do not use quotation marks in your response. Just return the plain text title.

Text: "${textForContext.substring(0, 250)}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: titleGenPrompt,
                config: {
                    maxOutputTokens: 20,
                },
            });
    
            const generatedText = response.text;
            if (generatedText) {
                const newTitle = generatedText.trim().replace(/["']/g, "");
                if (newTitle) {
                    setHistory(prev =>
                        prev.map(session =>
                            session.id === chatId ? { ...session, title: newTitle } : session
                        )
                    );
                }
            }
        } catch (error) {
            const errorString = String(error).toLowerCase();
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                console.warn("Title generation skipped due to API quota limit.");
            } else {
                console.error("Title Generation Error:", error);
            }
        }

        // Generate Thumbnail Emoji
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const emojiGenPrompt = `Based on the following text, provide a single, relevant emoji that represents the core topic. Respond with only the emoji character, and nothing else.

Text: "${textForContext.substring(0, 250)}"`;
            
            const emojiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: emojiGenPrompt,
                config: {
                    maxOutputTokens: 5,
                    temperature: 0.1,
                },
            });

            // FIX: Safely access and trim the response text to prevent a crash if it's undefined.
            const emojiText = emojiResponse.text;
            if (emojiText) {
                const emoji = emojiText.trim();
                // A simple validation to check if it's likely an emoji
                if (emoji && emoji.length > 0 && emoji.length < 5) {
                    setHistory(prev =>
                        prev.map(session =>
                            session.id === chatId ? { ...session, thumbnail: emoji } : session
                        )
                    );
                }
            }
        } catch (error) {
            const errorString = String(error).toLowerCase();
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                console.warn("Thumbnail emoji generation skipped due to API quota limit.");
            } else {
                console.error("Thumbnail Emoji Generation Error:", error);
            }
        }
    };

    // FIX: Update function signature to accept FormEvent or KeyboardEvent for better type safety.
    const handleSendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if ((!userInput.trim() && !imageFile) || isLoading) return;
    
        const isImageCommand = userInput.trim().startsWith('/image');
        const isQuizCommand = userInput.trim().startsWith('/quiz');
    
        const isNewChat = !activeChatId;
        let currentChatId = activeChatId;
        let initialMessages: Message[];
        let newSessionForCheck: ChatSession | null = null;
    
        if (isNewChat) {
            const newChatId = Date.now().toString();
            let title = userInput.trim().substring(0, 30);
            if (!title) {
                if (imageFile) {
                    title = t('imageConversationTitle');
                } else {
                    title = t('newChat');
                }
            }
            const newSession: ChatSession = { id: newChatId, title, timestamp: Date.now(), messages: [], model: activeModel };
            newSessionForCheck = newSession;
            setHistory(prev => [newSession, ...prev]);
            setActiveChatId(newChatId);
            currentChatId = newChatId;
            initialMessages = [];
        } else {
            initialMessages = history.find(s => s.id === currentChatId)?.messages || [];
        }
    
        const attachedImageBase64 = imageBase64;
        const attachedImageFile = imageFile;
    
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: userInput,
            imageUrl: attachedImageBase64
        };
        appendMessage(currentChatId, userMessage);
    
        const messagesForStream = [...initialMessages, userMessage];
    
        setUserInput('');
        setImageFile(null);
        setImageBase64(null);
    
        const sessionForCheck = newSessionForCheck || history.find(s => s.id === currentChatId);
        const modelForThisAction = sessionForCheck?.model || activeModel;
    
        setIsLoading(true);
        let modelResponseText = '';
        
        try {
            if (isImageCommand) {
                await handleIntelligentImageRequest(currentChatId, userMessage.text.replace('/image', '').trim(), modelForThisAction);
            } else if (isQuizCommand) {
                const args = userMessage.text.replace('/quiz', '').trim().split(/\s+/);
                let numQuestions = 10;
                let topic = '';
    
                if (args.length > 1 && !isNaN(parseInt(args[0], 10))) {
                    numQuestions = Math.min(Math.max(parseInt(args[0], 10), 3), 25);
                    topic = args.slice(1).join(' ');
                } else {
                    topic = args.join(' ');
                }
    
                if (modelForThisAction === 'general') {
                    await handleQuizGeneration(currentChatId, topic, numQuestions);
                } else {
                    await handleIntelligentQuizRequest(currentChatId, topic, numQuestions, modelForThisAction);
                }
            } else {
                 if (modelForThisAction === 'general' || attachedImageBase64) {
                    modelResponseText = await getStreamingChatResponse(currentChatId, userMessage.text, attachedImageBase64, attachedImageFile, messagesForStream);
                } else {
                    modelResponseText = await handleIntelligentChatRequest(currentChatId, userMessage.text, messagesForStream, modelForThisAction);
                }
            }

            if (isNewChat) {
                const textForContext = modelResponseText.trim() || userMessage.text.trim();
                if (textForContext) {
                    generateChatMetadata(currentChatId, textForContext, !!attachedImageBase64);
                }
            }
        } catch (error) {
            console.error("API Error:", error);
            const errorString = String(error).toLowerCase();
            let userFriendlyError: string;
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                userFriendlyError = t('quotaExceededError');
            } else {
                userFriendlyError = t('errorAPIGeneric');
            }
            appendMessage(currentChatId, { id: Date.now().toString(), role: 'model', text: userFriendlyError });
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const handleImageGeneration = async (chatId: string, imagePrompt: string) => {
        if (!imagePrompt) {
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: t('imageGenPromptError') });
            return;
        }

        const activeSessionModel = history.find(s => s.id === chatId)?.model || activeModel;
        const prefix = IMAGE_PROMPT_PREFIXES[activeSessionModel];
        const finalPrompt = `${prefix} ${imagePrompt}`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: finalPrompt }],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            let imageUrl: string | null = null;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                    break;
                }
            }

            if (imageUrl) {
                const modelMessage: Message = {
                    id: Date.now().toString(),
                    role: 'model',
                    text: t('imageGenInspiration').replace('{prompt}', imagePrompt),
                    imageUrl: imageUrl,
                };
                appendMessage(chatId, modelMessage);
            } else {
                 throw new Error("Image data not found in response.");
            }
        } catch (error) {
            console.error("Image Generation Error:", error);
            const errorString = String(error).toLowerCase();

            let userFriendlyError: string;
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                userFriendlyError = t('quotaExceededError');
            } else {
                userFriendlyError = t('errorAPIGeneric');
            }
            
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: userFriendlyError });
        }
    };

    const handleIntelligentImageRequest = async (chatId: string, topic: string, model: ModelType) => {
        if (!topic) {
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: t('imageGenPromptError') });
            return;
        }
    
        // The general model can handle any topic, so we bypass the relevance check.
        if (model === 'general') {
            await handleImageGeneration(chatId, topic);
            return;
        }
    
        const relevanceSchema = {
            type: Type.OBJECT,
            properties: {
                isTopicRelevant: { type: Type.BOOLEAN, description: "True if the topic is within my expertise, otherwise false." },
                reasoning: { type: Type.STRING, description: "A brief, user-facing explanation for the decision, written in the first person from my AI persona's perspective." },
                suggestedModel: { type: Type.STRING, description: "The key of the suggested model if not relevant (e.g., 'chemistry', 'history'). Should be null if the topic is relevant." }
            },
            required: ['isTopicRelevant', 'reasoning']
        };
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = NPIT_SYSTEM_INSTRUCTIONS[model];
            
            const prompt = `A user wants me to generate an image based on the topic: "${topic}". 
            My task is to determine if this topic falls within my specialized domain of expertise. 
            I need to respond ONLY with a valid JSON object that matches the provided schema.
            - If the topic is relevant to my expertise, I must set isTopicRelevant to true.
            - If it is not relevant, I must set isTopicRelevant to false, provide a witty, first-person reasoning for why I cannot create this specific image, and suggest the correct model key in suggestedModel.`;
    
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: relevanceSchema,
                },
            });
    
            const responseText = response.text;
            if (!responseText) {
                throw new Error("AI returned an empty response for image relevance check.");
            }
            const result = JSON.parse(responseText);
    
            if (result.isTopicRelevant) {
                await handleImageGeneration(chatId, topic);
            } else {
                let refusalMessage = result.reasoning || "That's not quite in my area of expertise for creating images.";
                if (result.suggestedModel && models.some(m => m.key === result.suggestedModel)) {
                    refusalMessage += ` [SUGGEST_MODEL:${result.suggestedModel}]`;
                }
                
                appendMessage(chatId, {
                    id: Date.now().toString(),
                    role: 'model',
                    text: refusalMessage,
                });
            }
        } catch (error) {
            console.error("Error during intelligent image request:", error);
            const errorString = String(error).toLowerCase();
            let userFriendlyError: string;
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                userFriendlyError = t('quotaExceededError');
            } else {
                userFriendlyError = t('imageGenRelevanceError');
            }
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: userFriendlyError });
        }
    };
    
    const handleIntelligentQuizRequest = async (chatId: string, topic: string, numQuestions: number, model: ModelType) => {
        if (!topic) {
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: t('quizPromptError') });
            return;
        }
    
        const relevanceSchema = {
            type: Type.OBJECT,
            properties: {
                isTopicRelevant: { type: Type.BOOLEAN, description: "True if the topic is within my expertise, otherwise false." },
                reasoning: { type: Type.STRING, description: "A brief, user-facing explanation for the decision, written in the first person from my AI persona's perspective." },
                suggestedModel: { type: Type.STRING, description: "The key of the suggested model if not relevant (e.g., 'chemistry', 'history'). Should be null if the topic is relevant." }
            },
            required: ['isTopicRelevant', 'reasoning']
        };
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = NPIT_SYSTEM_INSTRUCTIONS[model];
            
            const prompt = `A user has asked for a quiz on the topic: "${topic}". 
            Your task is to determine if this topic falls within your domain of expertise. 
            Respond ONLY with a valid JSON object matching the provided schema. 
            - If the topic is relevant, set isTopicRelevant to true.
            - If it is not relevant, set isTopicRelevant to false, provide a witty reasoning for why you cannot create the quiz, and suggest the correct model key in suggestedModel.`;
    
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: relevanceSchema,
                },
            });
    
            const responseText = response.text;
            if (!responseText) {
                throw new Error("AI returned an empty response for quiz relevance check.");
            }
            const result = JSON.parse(responseText);
    
            if (result.isTopicRelevant) {
                // Topic is relevant, proceed with quiz generation
                await handleQuizGeneration(chatId, topic, numQuestions);
            } else {
                // Topic is not relevant, refuse and suggest
                let refusalMessage = result.reasoning || "That's not quite in my area of expertise.";
                if (result.suggestedModel && models.some(m => m.key === result.suggestedModel)) {
                    refusalMessage += ` [SUGGEST_MODEL:${result.suggestedModel}]`;
                }
                
                appendMessage(chatId, {
                    id: Date.now().toString(),
                    role: 'model',
                    text: refusalMessage,
                });
            }
        } catch (error) {
            console.error("Error during intelligent quiz request:", error);
            const errorString = String(error).toLowerCase();
            let userFriendlyError: string;
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                userFriendlyError = t('quotaExceededError');
            } else {
                userFriendlyError = "Sorry, I had trouble figuring out if I can help with that quiz. Please try again.";
            }
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: userFriendlyError });
        }
    };
    
    const handleIntelligentChatRequest = async (chatId: string, prompt: string, initialMessages: Message[], model: ModelType): Promise<string> => {
        const relevanceSchema = {
            type: Type.OBJECT,
            properties: {
                isTopicRelevant: { type: Type.BOOLEAN, description: "True if the topic is within my expertise, otherwise false." },
                reasoning: { type: Type.STRING, description: "A brief, user-facing explanation for the decision, written in the first person from my AI persona's perspective." },
                suggestedModel: { type: Type.STRING, description: "The key of the suggested model if not relevant (e.g., 'chemistry', 'history'). Should be null if the topic is relevant." }
            },
            required: ['isTopicRelevant', 'reasoning']
        };

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = NPIT_SYSTEM_INSTRUCTIONS[model];
            
            const relevancePrompt = `A user has asked a question: "${prompt.substring(0, 500)}".
            Your task is to determine if this question falls within your specialized domain of expertise.
            Respond ONLY with a valid JSON object that matches the provided schema.
            - If the topic is relevant, set isTopicRelevant to true.
            - If it is not relevant, set isTopicRelevant to false, provide a witty, first-person reasoning for why you cannot answer, and suggest the correct model key in suggestedModel.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: relevancePrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: relevanceSchema,
                },
            });

            const responseText = response.text;
            if (!responseText) {
                throw new Error("AI returned an empty response for chat relevance check.");
            }
            const result = JSON.parse(responseText);

            if (result.isTopicRelevant) {
                return await getStreamingChatResponse(chatId, prompt, null, null, initialMessages);
            } else {
                let refusalMessage = result.reasoning || "That's not quite in my area of expertise.";
                if (result.suggestedModel && models.some(m => m.key === result.suggestedModel)) {
                    refusalMessage += ` [SUGGEST_MODEL:${result.suggestedModel}]`;
                }
                
                appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: refusalMessage });
                return refusalMessage;
            }
        } catch (error) {
            console.error("Error during intelligent chat request:", error);
            const errorString = String(error).toLowerCase();
            let userFriendlyError: string;
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                userFriendlyError = t('quotaExceededError');
            } else {
                userFriendlyError = t('chatRelevanceError');
            }
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: userFriendlyError });
            return userFriendlyError;
        }
    };

    const handleQuizGeneration = async (chatId: string, topic: string, numQuestions: number) => {
        if (!topic) {
             appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: t('quizPromptError') });
             return;
        }

        const quizSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The title of the quiz." },
                questions: {
                type: Type.ARRAY,
                description: `A list of ${numQuestions} questions for the quiz.`,
                items: {
                    type: Type.OBJECT,
                    properties: {
                    questionText: { type: Type.STRING, description: "The text of the question." },
                    questionType: { type: Type.STRING, description: "The type of question (e.g., 'multiple-choice', 'true-false', 'short-answer')." },
                    options: {
                        type: Type.ARRAY,
                        description: "A list of 4 possible answers for multiple-choice questions. Empty for other types.",
                        items: { type: Type.STRING }
                    },
                    correctAnswer: { type: Type.STRING, description: "The correct answer to the question." },
                    points: { type: Type.INTEGER, description: "The point value for this question, based on its type and complexity." }
                    },
                    required: ['questionText', 'questionType', 'correctAnswer', 'points']
                }
                }
            },
            required: ['title', 'questions']
        };

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are a helpful assistant that creates educational quizzes. Generate a quiz on the topic of "${topic}". The quiz should have a title and ${numQuestions} questions of varying types (multiple-choice, true-false, and short-answer/open-ended). For each question, assign a point value according to these rules: 'multiple-choice' and 'true-false' questions are worth exactly 1 point. 'short-answer' questions are worth 2 or 3 points depending on their complexity. Provide the output in the specified JSON format. Ensure the questions are clear and the answers are correct.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: quizSchema,
                },
            });

            const responseText = response.text;
            if (!responseText) {
                throw new Error("AI returned an empty response when generating quiz data.");
            }
            const quizResult = JSON.parse(responseText) as Quiz;
            setQuizData(quizResult);
            setIsQuizModalOpen(true);
            appendMessage(chatId, {
                id: Date.now().toString(),
                role: 'model',
                text: t('quizGeneratedMessage').replace('{topic}', topic),
            });
        } catch (e) {
            console.error("Failed to parse quiz JSON or generate quiz", e);
            const errorString = String(e).toLowerCase();
            let userFriendlyError: string;
            if (errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                userFriendlyError = t('quotaExceededError');
            } else {
                userFriendlyError = "Sorry, I had trouble creating the quiz. Please try a different topic.";
            }
            appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: userFriendlyError });
        }
    };
    
    const getStreamingChatResponse = async (chatId: string, prompt: string, imageBase64: string | null, imageFile: File | null, initialMessages: Message[]): Promise<string> => {
        if (!chatRef.current) {
             appendMessage(chatId, { id: Date.now().toString(), role: 'model', text: t('errorChatNotInit') });
             return '';
        }
        
        let stream;
        if (imageFile && imageBase64) {
            const parts: ContentPart[] = [
                { inlineData: { mimeType: imageFile.type, data: imageBase64.split(',')[1] } },
                { text: prompt }
            ];
            stream = await chatRef.current.sendMessageStream({ message: parts });
        } else {
            stream = await chatRef.current.sendMessageStream({ message: prompt });
        }
        
        let modelResponse = '';
        const messageId = Date.now().toString();
        
        appendMessage(chatId, { id: messageId, role: 'model', text: '' });

        const messagesForUpdate = [...initialMessages, { id: messageId, role: 'model' as const, text: '' }];


        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                modelResponse += chunkText;
                const updatedMessages = messagesForUpdate.map(m =>
                    m.id === messageId ? { ...m, text: modelResponse } : m
                );
                updateMessages(chatId, updatedMessages);
            }
        }
        return modelResponse;
    };
    
    const handleNewChat = () => {
        setActiveChatId(null);
        setUserInput('');
        setImageFile(null);
        setImageBase64(null);
        setIsSidebarOpen(false);
    };

    const handleSelectChat = (id: string) => {
        const session = history.find(s => s.id === id);
        if (session) {
            const sessionModel = session.model || 'general';
            setActiveModel(sessionModel);
            setActiveChatId(id);
            initChat(session.messages, sessionModel);
        }
        setIsSidebarOpen(false);
    };

    const handleDeleteChat = (id: string) => {
        setHistory(prev => prev.filter(s => s.id !== id));
        if (activeChatId === id) {
            handleNewChat();
        }
    };
    
    const handleRenameChat = (id: string, newTitle: string) => {
        setHistory(prev =>
            prev.map(session =>
                session.id === id ? { ...session, title: newTitle } : session
            )
        );
    };

    const handleModelChange = (model: ModelType) => {
        if (isLoading || model === activeModel) return;

        setIsModelSwapping(true);

        setTimeout(() => {
            setActiveModel(model);

            const lastSessionForModel = history
                .filter(session => (session.model || 'general') === model)
                .sort((a, b) => b.timestamp - a.timestamp)[0];

            if (lastSessionForModel) {
                handleSelectChat(lastSessionForModel.id);
            } else {
                setActiveChatId(null);
                setUserInput('');
                setImageFile(null);
                setImageBase64(null);
            }
            
            setIsModelSwapping(false);
        }, 300);
    };
    
    const getBotIconForModel = (modelType: ModelType) => {
        const iconProps = { className: "w-6 h-6 text-white" };
        switch (modelType) {
            case 'culinary': return <CulinaryIcon {...iconProps} />;
            case 'science': return <ScienceIcon {...iconProps} />;
            case 'history': return <HistoryIcon {...iconProps} />;
            case 'biology': return <BiologyIcon {...iconProps} />;
            case 'geography': return <GeographyIcon {...iconProps} />;
            case 'code': return <CodeIcon {...iconProps} />;
            case 'maths': return <MathsIcon {...iconProps} />;
            case 'chemistry': return <ChemistryIcon {...iconProps} />;
            case 'general':
            default:
                return <GeneralIcon {...iconProps} />;
        }
    }

    const activeSessionModel = history.find(s => s.id === activeChatId)?.model || activeModel;
    const modelColors = MODEL_COLORS[activeSessionModel];
    const suggestionRegex = /\[SUGGEST_MODEL:\s*([a-z]+)\s*\]/i;
    

    return (
        <div className="flex h-full bg-gray-800 rounded-lg m-4">
            <div className={`hidden md:flex flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isHistoryVisible ? 'w-64' : 'w-0'}`}>
                <div className="w-64 h-full">
                    <HistorySidebar 
                        sessions={history}
                        activeChatId={activeChatId}
                        onSelectChat={handleSelectChat}
                        onDeleteChat={handleDeleteChat}
                        onRenameChat={handleRenameChat}
                    />
                </div>
            </div>

            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
                    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 p-2" onClick={e => e.stopPropagation()}>
                         <HistorySidebar 
                            sessions={history}
                            activeChatId={activeChatId}
                            onSelectChat={handleSelectChat}
                            onDeleteChat={handleDeleteChat}
                            onRenameChat={handleRenameChat}
                        />
                    </div>
                </div>
            )}
            
            <div className="flex flex-col flex-1 border-l border-gray-700/50 relative">
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 hidden md:block z-10">
                    <button 
                        onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                        className="p-1 rounded-full bg-gray-700 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        title={isHistoryVisible ? t('hideHistory') : t('showHistory')}
                    >
                        <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isHistoryVisible ? '' : 'rotate-180'}`} />
                    </button>
                </div>
                
                <header className="flex items-center justify-start p-4 border-b border-gray-700/50 flex-shrink-0">
                     <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-white">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                
                <div className="hidden lg:flex justify-center items-center gap-1 bg-gray-800/30 p-2 border-b border-gray-700/50">
                    {models.map(model => (
                        <button
                            key={model.key}
                            onClick={() => handleModelChange(model.key)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${MODEL_BUTTON_COLORS[model.key].ring} ${activeModel === model.key ? `${MODEL_BUTTON_COLORS[model.key].active} text-white shadow-md` : 'text-gray-300 hover:bg-gray-700'}`}
                            title={`${t('yourExpertIn')} ${t(model.specialtyKey)}`}
                        >
                            {model.icon}
                            {model.name}
                        </button>
                    ))}
                </div>

                <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-4 transition-opacity duration-300 ${isModelSwapping ? 'opacity-0' : 'opacity-100'}`}>
                    {currentMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                           <div className={`p-4 rounded-full ${modelColors.icon} mb-4`}>
                               {getBotIconForModel(activeModel)}
                           </div>
                           <h2 className="text-2xl font-bold text-white mb-1">{models.find(m => m.key === activeModel)?.name}</h2>
                           <p className="mb-4">{`${t('yourExpertIn')} ${t(models.find(m => m.key === activeModel)?.specialtyKey ?? 'modelGeneral')}`}</p>
                           <p className="max-w-md">{t('startConversation')}</p>
                        </div>
                    ) : (
                        currentMessages.map(msg => {
                            const suggestionMatch = msg.role === 'model' ? msg.text.match(suggestionRegex) : null;
                            const cleanText = msg.text.replace(suggestionRegex, '').trim();
                            const suggestedModelKey = suggestionMatch ? suggestionMatch[1].toLowerCase() as ModelType : null;
                            const suggestedModel = suggestedModelKey ? models.find(m => m.key === suggestedModelKey) : null;

                            return (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                                    {msg.role === 'model' && (
                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${modelColors.icon}`}>
                                            {getBotIconForModel(activeSessionModel)}
                                        </div>
                                    )}
                                    <div className={`max-w-xl px-4 py-2 rounded-2xl shadow-md prose prose-invert prose-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : `${modelColors.bubble} text-white rounded-bl-none`}`}>
                                        {msg.imageUrl && (
                                            <div className="mb-2">
                                                <img 
                                                    src={msg.imageUrl} 
                                                    alt="User attachment" 
                                                    className="max-w-xs max-h-64 rounded-lg cursor-pointer" 
                                                    onClick={() => setZoomedImageUrl(msg.imageUrl!)}
                                                />
                                            </div>
                                        )}
                                        {cleanText && <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanText}</ReactMarkdown>}
                                        {suggestedModel && (
                                            <div className="mt-3 pt-3 border-t border-white/20">
                                                <p className="text-xs text-gray-300 mb-2">{t('modelSuggestionText').replace('{modelName}', suggestedModel.name)}</p>
                                                <button 
                                                    onClick={() => handleModelChange(suggestedModel.key)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${MODEL_BUTTON_COLORS[suggestedModel.key].ring} ${MODEL_BUTTON_COLORS[suggestedModel.key].active} text-white shadow-md hover:opacity-90`}
                                                >
                                                    {suggestedModel.icon}
                                                    {`${t('switchTo')} ${t(suggestedModel.specialtyKey)} ${t('expert')}`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-600">
                                            <UserIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                     {isLoading && (
                        <div className="flex justify-start items-end gap-3">
                             <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${modelColors.icon}`}>
                                {getBotIconForModel(activeSessionModel)}
                            </div>
                            <div className={`max-w-xl p-3 rounded-2xl shadow-md ${modelColors.bubble} text-white rounded-bl-none`}>
                                <Loader />
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} className="px-4 py-2 border-t border-gray-700/50 flex-shrink-0">
                    {imageBase64 && (
                        <div className="relative w-24 h-24 mb-2 p-1 border-2 border-dashed border-gray-600 rounded-lg">
                            <img src={imageBase64} alt="Preview" className="w-full h-full object-cover rounded"/>
                            <button
                                type="button"
                                onClick={() => { setImageFile(null); setImageBase64(null); }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold hover:bg-red-700"
                                title={t('removeImage')}
                            >
                                &times;
                            </button>
                        </div>
                    )}

                    <div className="relative flex items-center bg-gray-700/50 rounded-full">
                        <input ref={fileInputRef} type="file" accept="image/png, image/jpeg" onChange={handleImageSelect} className="hidden" />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()} 
                            title={t('attachImage')} 
                            className="p-3 ml-1 text-gray-400 hover:text-white rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <PaperclipIcon className="w-5 h-5" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            // FIX: Call preventDefault and ensure the event type is handled correctly.
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                            placeholder={t('inputPlaceholder')}
                            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-3"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || (!userInput.trim() && !imageFile)}
                            className="p-2 m-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-indigo-500"
                            aria-label={t('sendMessage')}
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {zoomedImageUrl && <ImageModal imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />}
                {isQuizModalOpen && quizData && <QuizModal quiz={quizData} onClose={() => setIsQuizModalOpen(false)} />}
            </div>
        </div>
    );
};

export default Chat;
