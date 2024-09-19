`base_db.json` is the starting database, to be used as a template or reset.
`db.json` contains the in-memory database that will be used when the app is live.

To run the backend: 
- `cd backend` 
- `npm install`
- `npm run start`
To run the frontend: 
- `cd frontend`
- `npm install`
- `npm run start`

In production the baseURL can just be an empty string, as they'll be hosted on the same server.
In dev, the base should be `localhost:8080` or whatever port the backend is configured at.

Build process
- Install `flyctl`: `curl -L https://fly.io/install.sh | sh` and follow directions in the prompt
- All-in-one: `npm run deploy:full`
- Indivdidual: `npm run build:ui` and then `npm run deploy`

Useful Fly.io commands:
- Connect to the deployed instance: `fly ssh console`
- Get the current database file: `fly sftp get ./data/db.json`
