import { BUILD } from '../data/build';

export const GET = () => new Response(JSON.stringify({ v: BUILD }), { headers: { 'Content-Type': 'application/json' } });
