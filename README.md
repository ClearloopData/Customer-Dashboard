
## Introduction

This project is a functional prototype for a customer dashboard, displaying real-time information about the performance of customers' share of Clearloop solar projects. 

## Getting Started

First, download/clone the code from GitHub. All the relevant files should be included on the GitHub, except for the following .env.local file that contains sensitive API info: https://siliconranch.box.com/s/ykb9hedqtwdgte0qyuzteat5bvg0fadz. Download this file and put it in the project folder ('My-Firebase-App'). 

The project is currently deployed live on Vercel. To run the project on your personal computer, paste the following command into your terminal/command prompt. 

```bash
npm run dev
```

**NOTE**: for first-time users, particularly users who don't code with React/Next.js, you will likely be told that you are missing lots of packages/depedancies. Simply follow any instructions in the error messages to get those packages/dependancies installed. Google and ChatGPT will be excellent resources in getting any setup issues resolved if they persist. 

Then, open [http://localhost:3000](http://localhost:3000) with your browser (copy and paste the link into Google Chrome, for example) to see the result.

To log in, you can use the dummy email and password:

testemail21@email.com
testpassword

## Tech Stack

### The Basics

The user interface is built with React/Next.js, and is connected to a few different data sources. All the main solar-project-related data is from the Clearloop-MainDB on Firebase. Additionally, the project uses a few APIs for the live weather, radar, etc. Lastly, there is a CSV file named 'CombinedProjectData.csv' in /public/data that was pulled from Quickbase and contains relevant project cite specific information (name of customer company, # of recs/carbon credits, etc, etc). 

### User Authentication

There are two Firebase projects associated with the dashboard. The first is titled 'CarbonDataApp'. When a user first logs in, the email and password they enter is checked with this Firebase project to see if it is valid. (Note, to add more valid accounts, simply go to the authentication page for this firebase project and add new emails there). If the user's email and password are valid, then the second Firebase project comes into play. The user is automatically (under the hood) logged into the Clearloop-MainDB using a shared account. The purpose of this design is to prevent the cluttering (and access) of customer accounts in the Clearloop main database.

## The Code

All code is in the /src folder. Within the folder, the code is organized as follows:

/app: contains the /api folder for managing the fact that two different firebase projects are being used at once. /dashboard contains the code that pulls and preprocesses all the **data** that will be used for the dashboard. It is **not** where the design/layout of the dashboard is established; that is in the components folder (see below). /auth contains the code for the log in page. 

/components: contains code for the various features on the dashboard, including code for the charts/graphs, radar, spinning globe, etc. NOTE: this section also contains the 'Dashboard' component, which is the code that determines the layout and contents of the main part of the dashboard page. 

/context: contains the AuthContext.tsx file

/lib: contains files that allow the dashboard to interact with Firebase and also the weather APIs. 

### Other files

The /public folder contains all the images (logos, icons, etc), as well as the aforementioned 'CombinedProjectData.csv' file. 

## Wenqing Demoing/Troubleshooting

- See 'Getting Started' section above for details on how to run the project locally on your computer. Note, there is no risk in 'messing up' the online version by changing code on your local computer; changing the online version requires 'committing' the changes to the main GitHub project (which Vercel then uses to deploy the code online). 
- Changing from Rivian to another company: go to the page.tsx file in the src/app/dashboard folder. There is a 'CUSTOMER_COMPANY' variable that is currently set to "Rivian". As of the time of this writing, it is on line 63 of the file. Simply change this variable to be the name of another customer company and save the file. **Important notes**:
    - The name needs to exactly (capitalization, spacing, etc) match the how it is written in column H of the 'CombinedProjectsData.csv' file (mentioned above).
    - **Since Arcadia is not live as of the time of this writing, only customer companies that do not have a deal in the new Arcadia project will work for demoing purposes**. If you try to use such a company (Chicory Wealth, Infoblox), you will get lots of errors because the project is trying to load data that does not yet exist!! This is all according to the 'CombinedProjectsData.csv' file; to check if a company would work for a demo, simply check if the company contains an Arcadia deal in the CSV file, and if it doesn't, it should work.
- Be mindful of monitor sizing. Before ever sharing the project on your large monitor screen/a TV, etc, check to ensure the project looks good on a large screen. It was difficult for me to test this given I did the majority of development on my small laptop screen. 
- Please feel free to email/text me if you have any issues with this project. My email is ztgillette @ gmail .com (with no spaces). 


## Next Steps

The project is currently a functional prototype and requires some additional development/testing work in order to be production-ready. Next steps for development might include:

Testing
- Login/data loading/security
- Formatting on devices of different sizes
- Various browser accessibility settings
- poor/no network environments (no errors)

Development
- System to map customer login info with their company (so that the correct solar farm data is loaded on login; currently Rivian loads always)
    - Download logo pngs for other companies (I only bothered with Rivian's logo)
- Community partnerships: collaborate with them to finish the cell
- Visual overview of solar farms: source better images/content for that cell
- Create button that auto-generates a pdf report of the data that the customer company can distribute
    - Ideally allow capibility to select specific time frames, projects, etc
- Settings menu
    - Light mode
    - Accessibility features
- UI Design: make professional, tidy; is marketing team assigned this?


