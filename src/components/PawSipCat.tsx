'use client';

import { useEffect, useRef, useState } from 'react';

// The PawSip cat, drawn from the same vector shapes as the Windows app.
const c = { outline: '#5E4339', fur: '#FFCF96', cream: '#FFF6EA', stripe: '#F4A962', ear: '#FFB7C4', blush: '#FF9DB3', nose: '#FF8DA6', eye: '#3A2C2A', bean: '#FFAFC0' };
const heart = 'M 10,18 C 10,18 0,12 0,5.5 C 0,1.5 3.5,-1 6.5,0.5 C 8.2,1.3 9.3,2.7 10,4 C 10.7,2.7 11.8,1.3 13.5,0.5 C 16.5,-1 20,1.5 20,5.5 C 20,12 10,18 10,18 Z';
const round = { strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function PawSipCat({ label = 'The PawSip cat. Click to pet it.' }: { label?: string }) {
  const [petting, setPetting] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pet = () => {
    setPetting(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPetting(false), 2000);
  };

  return <button type="button" className={`pawsip-cat${petting ? ' is-petting' : ''}`} onClick={pet} aria-label={label}>
    <svg viewBox="0 -14 220 238" aria-hidden="true">
      <ellipse cx="110" cy="211" rx="52" ry="8" fill="rgba(107,75,62,.16)"/>

      <g className="pc-tail">
        <path d="M 144,194 C 182,192 198,164 190,128" fill="none" stroke={c.outline} strokeWidth="19" {...round}/>
        <path d="M 144,194 C 182,192 198,164 190,128" fill="none" stroke={c.fur} strokeWidth="12" {...round}/>
        <path d="M 186,152 L 197,149 M 184,166 L 194,168" stroke={c.stripe} strokeWidth="4" {...round}/>
      </g>

      <g className="pc-body">
        <ellipse cx="75" cy="197" rx="17" ry="11" fill={c.fur} stroke={c.outline} strokeWidth="3.5"/>
        <ellipse cx="145" cy="197" rx="17" ry="11" fill={c.fur} stroke={c.outline} strokeWidth="3.5"/>
        <path d="M 74,126 C 56,150 56,190 76,204 L 144,204 C 164,190 164,150 146,126 Z" fill={c.fur} stroke={c.outline} strokeWidth="3.5" strokeLinejoin="round"/>
        <ellipse cx="110" cy="173" rx="24" ry="27" fill={c.cream}/>
        <path d="M 64,158 Q 72,160 75,168 M 62,172 Q 69,174 72,181 M 156,158 Q 148,160 145,168 M 158,172 Q 151,174 148,181" fill="none" stroke={c.stripe} strokeWidth="3.5" {...round}/>
      </g>

      <g>
        <ellipse cx="93" cy="201.5" rx="14" ry="9.5" fill={c.cream} stroke={c.outline} strokeWidth="3.2"/>
        <path d="M 89,197 L 89,203 M 97,197 L 97,203" stroke={c.outline} strokeWidth="1.8" {...round}/>
      </g>
      <g className="pc-paw-right">
        <ellipse cx="127" cy="201.5" rx="14" ry="9.5" fill={c.cream} stroke={c.outline} strokeWidth="3.2"/>
        <path d="M 123,197 L 123,203 M 131,197 L 131,203" stroke={c.outline} strokeWidth="1.8" {...round}/>
      </g>

      <g className="pc-head">
        <path d="M 50,70 C 44,42 50,22 60,16 C 72,18 86,30 96,44 Z" fill={c.fur} stroke={c.outline} strokeWidth="3.5" strokeLinejoin="round"/>
        <path d="M 58,60 C 56,44 59,32 64,27 C 71,31 79,38 86,47 Z" fill={c.ear}/>
        <path d="M 170,70 C 176,42 170,22 160,16 C 148,18 134,30 124,44 Z" fill={c.fur} stroke={c.outline} strokeWidth="3.5" strokeLinejoin="round"/>
        <path d="M 162,60 C 164,44 161,32 156,27 C 149,31 141,38 134,47 Z" fill={c.ear}/>
        <path d="M 110,30 C 154,30 178,58 178,92 C 178,126 148,142 110,142 C 72,142 42,126 42,92 C 42,58 66,30 110,30 Z" fill={c.fur} stroke={c.outline} strokeWidth="3.5"/>
        <path d="M 100,38 Q 102,46 99,54 M 110,35 L 110,50 M 120,38 Q 118,46 121,54" fill="none" stroke={c.stripe} strokeWidth="4" {...round}/>
        <path d="M 44,84 Q 52,85 56,90 M 176,84 Q 168,85 164,90" fill="none" stroke={c.stripe} strokeWidth="3.5" {...round}/>
        <ellipse cx="110" cy="116" rx="27" ry="18" fill={c.cream}/>
        <ellipse cx="67" cy="107.5" rx="12" ry="6.5" fill={c.blush} opacity=".55"/>
        <ellipse cx="153" cy="107.5" rx="12" ry="6.5" fill={c.blush} opacity=".55"/>
        <g className="pc-eyes">
          <ellipse cx="82" cy="89.5" rx="10" ry="12.5" fill={c.eye}/>
          <circle cx="84" cy="84" r="4" fill="#fff"/>
          <circle cx="77" cy="94" r="2" fill="#fff"/>
          <ellipse cx="138" cy="89.5" rx="10" ry="12.5" fill={c.eye}/>
          <circle cx="140" cy="84" r="4" fill="#fff"/>
          <circle cx="133" cy="94" r="2" fill="#fff"/>
        </g>
        <path className="pc-eyes-happy" d="M 72,94 Q 82,80 92,94 M 128,94 Q 138,80 148,94" fill="none" stroke={c.outline} strokeWidth="4" {...round}/>
        <path d="M 104,106 Q 110,102 116,106 Q 114,111 110,112 Q 106,111 104,106 Z" fill={c.nose} stroke={c.outline} strokeWidth="1.6" strokeLinejoin="round"/>
        <path className="pc-mouth" d="M 100,114 Q 105,121 110,114 Q 115,121 120,114" fill="none" stroke={c.outline} strokeWidth="2.6" {...round}/>
        <g className="pc-mouth-open">
          <path d="M 101,114 Q 110,113 119,114 Q 117,129 110,130 Q 103,129 101,114 Z" fill="#8E3D4C" stroke={c.outline} strokeWidth="2.4" strokeLinejoin="round"/>
          <ellipse cx="110" cy="125" rx="6" ry="4" fill="#FF98AE"/>
        </g>
        <path d="M 34,104 L 60,108 M 36,116 L 61,115 M 186,104 L 160,108 M 184,116 L 159,115" stroke={c.outline} strokeWidth="2" opacity=".5" {...round}/>
      </g>

      <g className="pc-arm">
        <path d="M 142,158 C 160,146 176,128 184,112" fill="none" stroke={c.outline} strokeWidth="21" {...round}/>
        <path d="M 142,158 C 160,146 176,128 184,112" fill="none" stroke={c.fur} strokeWidth="14" {...round}/>
        <ellipse cx="185" cy="102" rx="15" ry="14" fill={c.cream} stroke={c.outline} strokeWidth="3.2"/>
        <ellipse cx="185" cy="104.5" rx="5" ry="4.5" fill={c.bean}/>
        <circle cx="176.5" cy="95.5" r="2.5" fill={c.bean}/>
        <circle cx="184.5" cy="93.5" r="2.5" fill={c.bean}/>
        <circle cx="192.5" cy="96.5" r="2.5" fill={c.bean}/>
      </g>

      <g className="pc-hearts">
        <g transform="translate(36 30)"><path className="pc-heart" d={heart} fill="#FF7FA6"/></g>
        <g transform="translate(100 2)"><path className="pc-heart" d={heart} fill="#FF9BB8"/></g>
        <g transform="translate(164 24)"><path className="pc-heart" d={heart} fill="#FF7FA6"/></g>
      </g>
    </svg>
  </button>;
}
