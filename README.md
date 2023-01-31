
# Trello Clone - Thullo

A Trello Clone application called Thullo. Built with Next.js, Firebase, TailwindCSS and DnD Kit.




## Demo

Use the project at https://trello-clone-brown-psi.vercel.app

## Features

- Sign Up with email and password
- Sign In with email and password, Google or Github
- Create board
- Add list
- Add card to list
- Add card details like:
    - Cover
    - Description with a Rich Text Editor
    - Edit card title
- Drag and Drop cards to lists
- Invite members to collaborate in boards
- Realtime notifications for inviting users

## Tech Stack

- [Next](https://nextjs.org) as frontend framework
- [Firebase](https://firebase.com) for Backend as a Service
- [Tailwind CSS](https://tailwindcss.com) for styling
- [DnD Kit](https://dndkit.com) for Drag and Drop funtionality
- [TipTap](https://tiptap.dev) for Rich Text Editor feature
## Run Locally

Clone the project
```bash
git clone https://github.com/matews-sousa/trello-clone.git
cd trello-clone
```

Intall dependecies
```bash
npm install
```

Start the server
```bash
npm run dev
```

## Firebase and Unsplash configuration

Get an overview of Firebase, how to create a project, what kind of features Firebase offers, and how to navigate through the Firebase project dashboard in this [visual tutorial for Firebase](https://www.robinwieruch.de/firebase-tutorial/).

- copy/paste your configuration from your Firebase project's dashboard into one of these files
  - utils/firebase.ts
  - .env.local

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

The app alse have integration with the Unsplash API. Create a app in Unsplash and get the ACCESS KEY. Next, add the following to your .env.local file:

```
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```

1. Run `npm run dev`
2. Open http://localhost:3000

- For the authentication to work you need to enable Email/Password on Authentication section.
- For saving data you need to create database on Firestore Database section.
