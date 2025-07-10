# Jun 26

## Project Design Basics

### Database
- Firebase: realtime data already there, created new **app** to keep things seperated
- Local CSV: exported from quickbase
    - Manually add new project data :(

### Authentication / Security
- Firebase: created entire new **project** to handle user authentication, store users, etc, since we don't want to clutter the original database project with all the customer users... 
    - customer user logs in on ui -> authenticated by **new** firebase project -> if auth, then they are logged in to **original** Firebase db under a common user ("shared-access@carbonapp.com").

### Hosting
- Vercel probably, but cross that bridge later

### Frontend
- React Next.js



## Dashboard ideas

### Basics

1. Current combined production capacity (% of max) 
    - Can also see each individual projects' production capacity 
2. Show relevant weather conditions for each project to explain performance 
    - note: strange relationship between weather and performance yesterday...
3. Pure hourly energy production stat, hourly carbon avoidance stat
4. Health statistics (learn more about this)

### Ideas
5. Live weather radar (for visual appeal)
6. Fun stats/computations (tradeoff interesting vs. professional... not sure): 
    - what can the hourly production power (how many houses, how many lights, etc)? 
    - Weight equivalent of carbon avoidance (icon of boulder, elephant, house, etc)?

7. ML predictions of future performance

8. Other ideas? Interesting data? Have customers asked for anything in particular?


## Important considerations
* Regestration process: easy to manually add customer email, etc, but less scalable... ideas on design?
* Graphic design: for me certainly the biggest challenge of the project...
    - Company fonts, color schemes, etc





