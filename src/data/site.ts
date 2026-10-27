// All facts here come from Aaditya's master profile, CV and his own words.
// Do not add claims that are not documented there.

export const M = '/media';

export const reels = [
  'd7-lost-10kg', 'd3-gym-split', 'd4-maintenance', 'd5-deficit-math', 'd1-body-fat', 'd2-habit-stack',
  'd6-wake-up', 'd1-kinetic', 'd5-cutting', 'd7-chest-day', 'd4-weight-line', 'd6-health-ai',
];

export const drawings = [
  { id: 'old-man', title: 'Old Man' },
  { id: 'the-nun', title: 'The Nun' },
  { id: 'thanos', title: 'Thanos' },
  { id: 'eye', title: 'Eye' },
  { id: 'wolverine', title: 'Wolverine' },
  { id: 'jungkook', title: 'Jungkook' },
  { id: 'kai', title: 'Kai' },
  { id: 'captain-america', title: 'Captain America' },
  { id: 'moon-knight', title: 'Moon Knight' },
  { id: 'iron-man', title: 'Iron Man' },
  { id: 'cat', title: 'Cat' },
  { id: 'venom', title: 'Venom' },
  { id: 'ultra-instinct-goku', title: 'Ultra Instinct Goku' },
];

export const clips3d = [
  { id: 'car-reveal', label: 'Sports car' },
  { id: 'bottle-a', label: 'Perfume bottle' },
  { id: 'glasses-a', label: 'Sunglasses' },
  { id: 'bottle-d', label: 'Perfume, macro' },
  { id: 'car-orbit', label: 'Sports car, studio' },
];

export const folders = [
  { name: 'Marketing', color: 'red', items: ['Content calendars', 'Short-form video', 'Social media growth', 'Google Ads', 'Visual SEO', 'AI content creation'] },
  { name: 'Sales', color: 'green', items: ['Closing bookings', 'Client follow-up', 'Elevator pitches', 'Negotiating price', 'Handling objections', 'CRM systems'] },
  { name: 'AI & Data', color: 'ivory', items: ['Prompt engineering', 'Agentic workflows', 'n8n and Claude Code', 'Google Analytics 4', 'Power BI', 'Predictive analytics'] },
  { name: 'Design', color: 'steel', items: ['3D in Blender', 'Digital illustration', 'Video editing', 'Thumbnails', 'Canva'] },
  { name: 'Languages', color: 'red', items: ['English, C1', 'German, B2', 'Hindi, native'], sheets: [['Hindi, native'], ['English, C1', 'German, B2']] },
];

// tools with a Simple Icons slug get the real logo; the rest get a lettermark
export const tools = [
  { name: 'Claude Code', icon: 'siClaude' },
  { name: 'ChatGPT', icon: 'siOpenai' },
  { name: 'Perplexity', icon: 'siPerplexity' },
  { name: 'Comet', mark: 'C', hex: '20808D' },
  { name: 'NotebookLM', mark: 'NB', hex: 'EFEAE2' },
  { name: 'Google AI Studio', icon: 'siGooglegemini' },
  { name: 'n8n', icon: 'siN8n' },
  { name: 'Apify', mark: 'AP', hex: '97D700' },
  { name: 'Julius AI', mark: 'J', hex: '5B4BDB' },
  { name: 'ElevenLabs', icon: 'siElevenlabs' },
  { name: 'Wispr Flow', mark: 'WF', hex: 'F4F1EA' },
  { name: 'Typeless', mark: 'T', hex: '111111' },
  { name: 'Motion', mark: 'M', hex: 'F5A623' },
  { name: 'Pomelli', mark: 'P', hex: 'D42A20' },
  { name: 'Canva', icon: 'siCanva' },
  { name: 'Meta Business', icon: 'siMeta' },
  { name: 'YouTube', icon: 'siYoutube' },
  { name: 'Google Ads', icon: 'siGoogleads' },
  { name: 'Google Analytics 4', icon: 'siGoogleanalytics' },
  { name: 'Power BI', mark: 'BI', hex: 'F2C811' },
  { name: 'Tableau', icon: 'siTableau' },
  { name: 'TradingView', icon: 'siTradingview' },
  { name: 'Excel', mark: 'X', hex: '217346' },
  { name: 'Word', mark: 'W', hex: '2B579A' },
  { name: 'Outlook', mark: 'O', hex: '0078D4' },
  { name: 'Teams', mark: 'T', hex: '6264A7' },
  { name: 'OneNote', mark: 'N', hex: '7719AA' },
  { name: 'Blender', icon: 'siBlender' },
  { name: 'DaVinci Resolve', icon: 'siDavinciresolve' },
];

export const countries = [
  { code: 'in', name: 'India' },
  { code: 'at', name: 'Austria' },
  { code: 'es', name: 'Spain' },
  { code: 'fi', name: 'Finland' },
  { code: 'fr', name: 'France' },
  { code: 'be', name: 'Belgium' },
  { code: 'de', name: 'Germany' },
  { code: 'pl', name: 'Poland' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'us', name: 'United States' },
];

// collage: photo, caption only where the place is certain
export const life = [
  { img: 'paris', cap: 'Paris', r: 0.75 },
  { img: 'gym-2', cap: '', r: 1.77 },
  { img: 'spain-costa-brava', cap: 'Spain', r: 0.87 },
  { img: 'finland', cap: 'Helsinki', r: 0.75 },
  { img: 'austria-friends', cap: 'Vienna', r: 1.33 },
  { img: 'france-hike', cap: '', r: 0.75 },
  { img: 'belgium', cap: 'Brussels', r: 0.75 },
  { img: 'gym-1', cap: '', r: 1.76 },
  { img: 'strasbourg', cap: 'Strasbourg', r: 0.75 },
  { img: 'poland', cap: 'Poland', r: 1.78 },
  { img: 'india', cap: 'India', r: 0.75 },
  { img: 'austria-schneeberg', cap: 'Schneeberg', r: 1.78 },
  { img: 'spain-cathedral', cap: 'Barcelona', r: 0.75 },
  { img: 'paris-eiffel', cap: '', r: 0.75 },
  { img: 'gym-3', cap: '', r: 1.78 },
  { img: 'poland-friends', cap: '', r: 1.78 },
  { img: 'austria-schonbrunn', cap: 'Schönbrunn', r: 0.56 },
  { img: 'paris-seine', cap: '', r: 0.75 },
  { img: 'france-hike-2', cap: '', r: 0.46 },
  { img: 'spain-castle', cap: '', r: 1.33 },
  { img: 'finland-team', cap: '', r: 1.78 },
  { img: 'about-bar', cap: '', r: 0.56 },
];

export type Project = {
  slug: string;
  n: string;
  name: string;
  short: string;
  line: string;
  role: string;
  when: string;
  where: string;
  result: string;
  stats: { n: string; label: string }[];
  story: { h: string; p: string }[];
  learned?: string;
};

export const projects: Project[] = [
  {
    slug: 'go-car',
    n: '01',
    name: 'Go Car',
    short: 'Go Car Barcelona',
    line: 'Sales and marketing internship at a GPS-guided city tour company in Barcelona.',
    role: 'Sales & Marketing Operations Intern',
    when: 'Jun - Aug 2026',
    where: 'Barcelona, Spain',
    result: '118,000+ organic views, 20+ bookings closed',
    stats: [
      { n: '118,000+', label: 'Organic views across Instagram and TikTok' },
      { n: '20+', label: 'New bookings sold and closed' },
      { n: '80+', label: 'Hotels reached for a referral channel' },
      { n: '20%', label: 'Less weekly admin for the CEO' },
    ],
    story: [
      { h: 'Content, planned ahead', p: 'The task was to post every day and come up with ideas each morning. Nobody asked for a calendar, so I planned and scheduled 60 days in advance, with posting times, hashtags, audio trends and hook-based reels. The team stopped starting from zero every day.' },
      { h: 'What it did', p: 'The reels reached 30,000+ organic views on Instagram in about two months and 88,651 views on TikTok across about 20 videos. Together that is 118,000+ views.' },
      { h: 'Selling', p: 'I sold and closed 20+ new bookings, with a strategy tailored to each client, and handled the follow-ups for 50+ existing reservations.' },
      { h: 'A channel from scratch', p: 'I built a hotel partnership channel, taking flyers to 80+ hotels to bring in referral bookings.' },
      { h: 'Automation with the CEO', p: 'I worked directly with the CEO to automate 3 recurring workflows with AI tools, which cut his weekly admin time by 20%. I used n8n, Claude Code and Apify every day.' },
      { h: 'A promo for the shop screen', p: 'A muted promo that runs on the screen in the shop, cut from the company\'s own photos and clips.' },
    ],
  },
  {
    slug: 'lean-log',
    n: '02',
    name: 'Lean Log',
    short: 'The Lean Log',
    line: 'My own fitness brand on YouTube, Instagram and TikTok.',
    role: 'Founder, filming, editing and growth',
    when: 'Since Oct 2026',
    where: 'YouTube, Instagram, TikTok',
    result: '16,000+ views in the first four weeks',
    stats: [
      { n: '16,000+', label: 'Views on YouTube and Instagram in four weeks' },
      { n: '2', label: 'Reels per platform, every day' },
      { n: '85.6%', label: 'Of Instagram views from non-followers' },
      { n: '-10 kg', label: 'Lost in 4 months, the story behind it' },
    ],
    story: [
      { h: 'The idea', p: 'A vlog series about discipline and getting 1% better every day, told through my own training. Every talk mixes my experience, fitness and one lesson about growth.' },
      { h: 'How it runs', p: 'I film. Reels, captions and thumbnails are built with AI tools. Two reels go out per platform every day, and a long vlog for each training day.' },
      { h: 'Run by the numbers', p: 'Every Sunday I review the analytics and change hooks, titles and posting times from what the numbers say.' },
      { h: 'First four weeks', p: '8,536 views on YouTube in 28 days and 7,982 on Instagram, with 85.6% of the Instagram views coming from people who did not follow me yet.' },
    ],
  },
  {
    slug: 'sales-week',
    n: '03',
    name: 'Sales Week',
    short: 'International Sales Week',
    line: 'Representing FH Wiener Neustadt at Haaga-Helia in Helsinki, on Erasmus+.',
    role: 'Team member, FHWN delegation',
    when: 'May 2026',
    where: 'Helsinki, Finland',
    result: '2nd place in the final',
    stats: [
      { n: '2nd', label: 'Place in the final' },
      { n: '1', label: 'Real corporate case, pitched live' },
    ],
    story: [
      { h: 'The format', p: 'A week of sales competition on a real corporate case, in a multicultural team.' },
      { h: 'What I did', p: 'Elevator pitch, customer-need analysis, stakeholder questions and a value-based presentation. Then the hard part: negotiating price, handling objections and closing under competitive pressure.' },
      { h: 'Result', p: 'Our team took 2nd place in the final.' },
    ],
  },
];
