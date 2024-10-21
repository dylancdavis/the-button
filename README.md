A simple multiplayer browser game inspired by Reddit's own [Button](https://en.wikipedia.org/wiki/The_Button_(Reddit)), hosted at [button.quest](https://button.quest). When players press the button, they get points proportional to how long it's been since the button has been pressed.

The application is built on React and Express and uses WebSockets to provide realtime updates on other player's presses. Supabase provides easy access to a PostgreSQL database to store player data, with Fly.IO for easy deployment. While the frontend can be run independently, the backend expects it to be built and stored in a `build/` folder that it can then serve from, and the frontend expects to be able to make API requests to the same server it's hosted from.

First, build the frontend:
- `cd frontend`
- `npm install`
- `cd backend`
- `npm run build:ui`
Then, run the backend:
- Add SUPABASE_KEY to a `.env` file (if using Supabase)
- `npm install`
- `npm run start`

Deployment:
- Install `flyctl`: `curl -L https://fly.io/install.sh | sh` and follow directions in the prompt
- Build and deploy: `npm run deploy:full`
- Or, individually: `npm run build:ui` and then `npm run deploy`

Useful Fly.io commands:
- Connect to the deployed instance: `fly ssh console`
- Get the current database file: `fly sftp get ./data/db.json`
