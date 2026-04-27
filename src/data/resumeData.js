export const RESUME = {
  name: 'Krish Sarode',
  location: 'Nagpur, Maharashtra, India',
  email: 'krishsarode18@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/krish-sarode-70392b356',
    github: 'https://github.com/Krish-x90',
    hackerrank: 'https://www.hackerrank.com/profile/krishsarode18'
  },
  objective: 'Electronics & Communication Engineer. Full-stack Developer. Innovator. Seeking opportunities to apply technical knowledge and build innovative engineering and software solutions.',

  education: [
    { school: 'S.B. Jain Institute of Technology, Nagpur', degree: 'BTech, Electrical, Electronics and Communication Engineering', year: '2027' },
    { school: 'Government Polytechnic College', degree: 'Diploma in Electronics and Telecommunication', year: '2024' },
    { school: 'St Vincent Pallotti School', degree: 'Secondary School Certificate', year: '2020' }
  ],

  experience: [
    { company: 'UCN Cable Network Pvt. Ltd.', role: 'Intern', period: 'Jan 2024 - Apr 2024', details: ['Maintained cable network infrastructure', 'Resolved connectivity issues', 'Signal distribution expertise'] },
    { company: 'Subros Ltd', role: 'QA Tester', period: 'Jan 2023', details: ['Verified product quality in manufacturing', 'Learned automotive AC system fundamentals'] },
    { company: 'All India Radio', role: 'Student Trainee', period: 'Jul 2022', details: ['Observed broadcasting systems', 'Studied audio transmission systems'] }
  ],

  projects: [
    { name: 'Automated Trading Bot', desc: 'Algorithmic trading bot with paper trading, 4 strategies (EMA Crossover, RSI+VWAP, MACD, Politician Follow), risk management, real-time dashboard', tech: 'Python, JavaScript, Alpaca API, Coinbase', github: 'https://github.com/Krish-x90/AutomatedTradingBot' },
    { name: 'Lumina Tour', desc: 'AI-powered landmark explorer using Google Gemini for real-time landmark identification, audio guides, historical timelines, image search', tech: 'React, TypeScript, Google Gemini API, Vite', github: 'https://github.com/Krish-x90/Lumina-Tour', live: 'https://lumina-tour-peach.vercel.app' },
    { name: 'Micky Music', desc: 'Full-stack music streaming app using React, Django, Firebase and JioSaavn API', tech: 'React, Django, Firebase', live: true },
    { name: 'Potato TV', desc: 'Anime streaming platform with React, Node.js, MongoDB, authentication and watchlists', tech: 'React, Node.js, MongoDB', live: true },
    { name: 'Quadcopter', desc: 'Designed a Quadcopter using Arduino as flight controller', tech: 'Arduino, C++' },
    { name: 'PID Line Following Bot', desc: 'A PID line following bot using Teensy 4.1 with high speed motor and high response time', tech: 'Teensy 4.1, Embedded C' }
  ],

  skills: {
    featured: ['React', 'TypeScript', 'Python', 'Node.js', 'Django', 'Firebase', 'MongoDB', 'Gemini API', 'Arduino', 'Embedded C'],
    leadership: ['Technical Head (FEETA Forum)', 'Team Leadership', 'Team Coordination', 'Creative Direction'],
    technical: [
      'Agentic AI',
      'Data Structures & Algorithms',
      'JavaScript',
      'TypeScript',
      'React',
      'Vite',
      'Node.js',
      'Django',
      'Python',
      'Firebase',
      'MongoDB',

      'Risk Management',
      'Realtime Dashboards',
      'Embedded C',

      'Embedded Systems',
      'Arduino IDE',
      'Teensy 4.1',
      'PID Control',
      'HTML/CSS',
      'After Effects',
      'Motion Graphics'
    ],
    projectBased: [
      'AI landmark recognition',
      'Audio guide UX',
      'Trading strategy engines',
      'Paper trading systems',
      'Risk dashboards',
      'Full-stack streaming',
      'Authentication flows',
      'Watchlists',
      'Arduino flight control',
      'PID robotics',
      'Realtime APIs',
      'Creative media systems'
    ],
    categories: [
      {
        title: 'AI + Web',
        items: ['React', 'TypeScript', 'Vite', 'Google Gemini API', 'Audio Guides', 'Image Search']
      },
      {
        title: 'Backend + Data',
        items: ['Node.js', 'Django', 'Firebase', 'MongoDB', 'REST APIs', 'Realtime Dashboards']
      },
      {
        title: 'Fintech Systems',
        items: ['Python', 'Alpaca API', 'Coinbase API', 'EMA/RSI/MACD', 'Risk Management']
      },
      {
        title: 'Embedded + Robotics',
        items: ['Arduino', 'Teensy 4.1', 'Embedded C/C++', 'PID Control', 'Flight Control']
      },
      {
        title: 'Creative Tech',
        items: ['After Effects', 'Motion Graphics', 'Video Editing', 'Interactive Design']
      }
    ]
  },

  certifications: [
    'Deloitte Australia - Technology Job Simulation (Forage)',
    'Anthropic - Claude Code in Action',
    'Anthropic - Introduction to Agent Skills'
  ],

  languages: ['English', 'Hindi', 'Marathi'],

  extras: {
    hobbies: ['Motion Graphics', 'Video Editing', 'Gaming', 'Design', 'Creative Media'],
    tools: ['After Effects', 'Creative Suite']
  }
};

// Marvel villains and Avenger powers per tunnel
export const TUNNEL_THEMES = {
  1: { villain: 'LOKI', villainColor: 0x22aa44, villainPower: 'Mirror Daggers', villainPowerKey: 'mirror', power: 'THOR - Lightning Bolt', powerColor: 0x44aaff, powerKey: 'lightning' },
  2: { villain: 'ULTRON', villainColor: 0xcc3333, villainPower: 'Omega Laser Sweep', villainPowerKey: 'laser', power: 'IRON MAN - Repulsor Blast', powerColor: 0xff4444, powerKey: 'repulsor' },
  3: { villain: 'MYSTERIO', villainColor: 0x8844cc, villainPower: 'Holo Mist Trap', villainPowerKey: 'mist', power: 'SPIDER-MAN - Web Shot', powerColor: 0xffffff, powerKey: 'web' },
  4: { villain: 'KILLMONGER', villainColor: 0xddaa00, villainPower: 'Vibranium Pounce', villainPowerKey: 'pounce', power: 'BLACK PANTHER - Vibranium Slash', powerColor: 0x8844ff, powerKey: 'slash' },
  5: { villain: 'RED SKULL', villainColor: 0xff0000, villainPower: 'Tesseract Bolt', villainPowerKey: 'cube', power: 'CAPTAIN AMERICA - Shield Throw', powerColor: 0x3366ff, powerKey: 'shield' },
  6: { villain: 'THANOS', villainColor: 0x8833aa, villainPower: 'Six Infinity Stones', villainPowerKey: 'shockwave', power: 'MULTI-POWER LOADOUT', powerColor: 0xffd447, powerKey: 'smash' }
};
