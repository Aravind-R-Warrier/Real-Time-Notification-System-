
A modern SaaS-style Admin Dashboard built with React + TypeScript, featuring real-time simulated notifications, analytics charts, and a clean responsive UI.



Features-
--------

Real-Time Notification System

Simulated live notifications (mock service)

Read / unread states

Mark all as read

Delete notifications

Persistent unread count (localStorage)

Notification sound on new message

Smooth animations (Framer Motion)

csv Downloads 

Dark mode


Tech Stack-
-----------

React 19

TypeScript

React Router DOM

Tailwind CSS

Framer Motion

Recharts

Lucide Icons

UUID


Depended Libs
-------------
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.10.1",
  "tailwindcss": "^4.1.17",
  "framer-motion": "^12.23.26",
  "recharts": "^3.5.1",
  "lucide-react": "^0.560.0",
  "uuid": "^13.0.0"
}


Project Structure
-----------------
src/
├── api/mock/        # Mock APIs & local JSON data
├── components/      # Reusable UI components
├── hooks/           # Custom hooks
├── pages/           # Dashboard, Analytics, Settings, Help
├── routes/          # App routing
├── types/           # TypeScript types
├── App.tsx
└── main.tsx

For Running Project After cloning-
-------          --------
npm install
npm run dev
