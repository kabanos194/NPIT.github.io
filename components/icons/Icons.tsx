
import React from 'react';

export const ChatIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export const NpitLogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 4H6l6 8-6 8h12" />
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const GeneralIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <circle cx="9.5" cy="10" r="1.5" />
        <circle cx="14.5" cy="10" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 10h2" />
    </svg>
);

export const CulinaryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5,15 V11 C2,10,2,4,7,3 C8,0,16,0,17,3 C22,4,22,10,19,11 V15 H5 Z" />
      <path d="M6,17 C6,21,11,21,12,19 C13,21,18,21,18,17 C16,19,8,19,6,17 Z" />
    </svg>
);

export const ScienceIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

export const BiologyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5a2.5 2.5 0 00-5 0v15a2.5 2.5 0 005 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4.5a2.5 2.5 0 015 0v15a2.5 2.5 0 01-5 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8" />
    </svg>
);

export const CodeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);

export const MathsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const ChemistryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="9" ry="4" />
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
    </svg>
);

export const GeographyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-gray-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// FIX: Changed the StopIcon to a square, which is the standard representation for "stop", improving UX clarity.
export const StopIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
       <rect x="5" y="5" width="10" height="10" rx="1" />
    </svg>
);

export const PaperclipIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const LanguageIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 9h17M12 3a13.9 13.9 0 00-4 18 13.9 13.9 0 008 0A13.9 13.9 0 0012 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 15h17" />
    </svg>
);

export const PrintIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V4a2 2 0 012-2h2a2 2 0 012 2v4" />
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
    </svg>
);

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-white animate-spin" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const FlagUSIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 13 7">
        <path fill="#B22234" d="M0 0h13v7H0z"/>
        <path fill="#fff" d="M0 1h13v1H0zm0 2h13v1H0zm0 2h13v1H0z"/>
        <path fill="#3C3B6E" d="M0 0h6v4H0z"/>
    </svg>
);

export const FlagESIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 6 4">
        <path fill="#C60B1E" d="M0 0h6v4H0z"/>
        <path fill="#FFC400" d="M0 1h6v2H0z"/>
    </svg>
);

export const FlagDEIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 5 3">
        <path d="M0 0h5v3H0z"/>
        <path fill="#D00" d="M0 1h5v2H0z"/>
        <path fill="#FFCE00" d="M0 2h5v1H0z"/>
    </svg>
);

export const FlagFRIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 3 2">
        <path fill="#fff" d="M0 0h3v2H0z"/>
        <path fill="#002395" d="M0 0h1v2H0z"/>
        <path fill="#ED2939" d="M2 0h1v2H2z"/>
    </svg>
);

export const FlagPLIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 8 5">
        <path fill="#fff" d="M0 0h8v5H0z"/>
        <path fill="#DC143C" d="M0 2.5h8v2.5H0z"/>
    </svg>
);

export const FlagITIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 3 2">
        <path fill="#009246" d="M0 0h1v2H0z"/>
        <path fill="#fff" d="M1 0h1v2H1z"/>
        <path fill="#CE2B37" d="M2 0h1v2H2z"/>
    </svg>
);

export const FlagPTIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 6 4">
        <path fill="#006233" d="M0 0h2v4H0z"/>
        <path fill="#D21034" d="M2 0h4v4H2z"/>
    </svg>
);

export const FlagJPIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#fff"/>
        <circle cx="1.5" cy="1" r=".6" fill="#BC002D"/>
    </svg>
);

export const FlagINIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 9 6">
        <path fill="#FF9933" d="M0 0h9v2H0z"/>
        <path fill="#FFF" d="M0 2h9v2H0z"/>
        <path fill="#138808" d="M0 4h9v2H0z"/>
        <circle cx="4.5" cy="3" r="0.8" fill="#000080"/>
    </svg>
);

export const FlagCNIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 210 140">
        <rect width="210" height="140" fill="#de2910"/>
        <path d="M35 35 L46.755 70.405 L12.225 46.905 H57.775 L23.245 70.405 Z" fill="#ffde00"/>
        <g transform="translate(70 21) rotate(23.4)">
            <path d="M0 0 L-7.854 24.184 L-25.567 14.944 H19.859 L-19.859 -14.944 Z" fill="#ffde00"/>
        </g>
        <g transform="translate(84 35) rotate(45.8)">
            <path d="M0 0 L-7.854 24.184 L-25.567 14.944 H19.859 L-19.859 -14.944 Z" fill="#ffde00"/>
        </g>
        <g transform="translate(84 56) rotate(69.2)">
            <path d="M0 0 L-7.854 24.184 L-25.567 14.944 H19.859 L-19.859 -14.944 Z" fill="#ffde00"/>
        </g>
        <g transform="translate(70 70) rotate(90)">
            <path d="M0 0 L-7.854 24.184 L-25.567 14.944 H19.859 L-19.859 -14.944 Z" fill="#ffde00"/>
        </g>
    </svg>
);

export const FlagKRIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 36 24">
        <rect width="36" height="24" fill="#fff"/>
        <circle cx="18" cy="12" r="6" fill="#CD2E3A"/>
        <path d="M18 6a6 6 0 0 0 0 12c-3.314 0-6-2.686-6-6s2.686-6 6-6z" fill="#0047A0"/>
        <g fill="#000">
            {/* Top-left: Geon (Heaven) ☰ */}
            <g transform="translate(6, 3)">
                <rect width="6" height="1.5" y="0" />
                <rect width="6" height="1.5" y="2.25" />
                <rect width="6" height="1.5" y="4.5" />
            </g>
            {/* Bottom-right: Gon (Earth) ☷ */}
            <g transform="translate(24, 15)">
                <rect width="2.625" height="1.5" y="0" />
                <rect width="2.625" height="1.5" y="0" x="3.375" />
                <rect width="2.625" height="1.5" y="2.25" />
                <rect width="2.625" height="1.5" y="2.25" x="3.375" />
                <rect width="2.625" height="1.5" y="4.5" />
                <rect width="2.625" height="1.5" y="4.5" x="3.375" />
            </g>
            {/* Top-right: Gam (Water) ☵ */}
            <g transform="translate(24, 3)">
                <rect width="2.625" height="1.5" y="0" />
                <rect width="2.625" height="1.5" y="0" x="3.375" />
                <rect width="6" height="1.5" y="2.25" />
                <rect width="2.625" height="1.5" y="4.5" />
                <rect width="2.625" height="1.5" y="4.5" x="3.375" />
            </g>
            {/* Bottom-left: Ri (Fire) ☲ */}
            <g transform="translate(6, 15)">
                <rect width="6" height="1.5" y="0" />
                <rect width="2.625" height="1.5" y="2.25" />
                <rect width="2.625" height="1.5" y="2.25" x="3.375" />
                <rect width="6" height="1.5" y="4.5" />
            </g>
        </g>
    </svg>
);

export const FlagRUIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 9 6">
        <rect width="9" height="2" y="0" fill="#fff"/>
        <rect width="9" height="2" y="2" fill="#0039a6"/>
        <rect width="9" height="2" y="4" fill="#d52b1e"/>
    </svg>
);

export const FlagTZIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-auto" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 9 6">
        <path fill="#1EB53A" d="M0 0h9v6H0z"/>
        <path fill="#00A3DD" d="M9 0v6H0z"/>
        <path stroke="#FCD116" strokeWidth="2.25" d="M0 6L9 0"/>
        <path d="M0 6L9 0" stroke="#000" strokeWidth="1.5"/>
    </svg>
);
