## Getting Started

To run on development server (locally on machine):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack
- Frontend: Next.js/React
- Authentication; Security: Firebase
    - Current authentication process: All customers attempt to log in to the 'CarbonDataApp' Firebase project. Once authenticated, then (under the hood) the user is logged into the main 'Clearloop-MainDB' Firebase project under a shared user so that this Firebase project is not cluttered with users. 
- Data: mostly Firebase ('Clearloop-MainDB'), but also from CSV file; weather data etc from an API
- Deployment: Vercel (similar to most other Clearloop projects)

## Codebase
- src
    - api
        - sign-in-db: authentication code
    - auth: authentication code
    - dashboard: react hooks, data loading and preprocessing for dashboard
    - components: all the components for the dashboard, INCLUDING DASHBOARD LAYOUT CODE

## Deployment
- Deployed on Vercel

## Next Steps
- Determine how customers will be granted access/create account, etc (i.e. do we add their email directly to Firebase, make an automated system, etc?)
    - add logo for all companies (only Rivian currently)
- Layout resizing, general UI: lots of testing and improvements
- Settings menu (light mode, etc)


