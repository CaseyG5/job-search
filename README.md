# Sprint 5 Overview

## "Problem"
Pick a job search API and use it to fetch and display jobs data. Show the 10 most recent 
software engineering jobs and allow the user to... 
- search for all jobs posted within the last 48 hours.
- specify a date and view the jobs posted within the past 48 hours of that date. 
- save a job which will be displayed on their homepage or "saved jobs" page, in addition
to the 10 most recent jobs.
- pick a fancy name for this applet
  
Begin on 7/12 and deliver by 7/23

## Solution
### Method:
This web applet was written primarily in JavaScript in order to get data via HTTP
from a server, pick out the relevant fields of a JSON object, format and display them in
dynamically created table rows, and listen for events based on user actions.
HTML and Tailwind CSS were used as before.  

### Process: ~~scoping~~, ~~branching~~, coding, committing progress, merging, and deploying

- Noting tasks on project board
- Designing the webpage(s) and user interface
- Writing HTML for base content and CSS for styling
- Writing pseudo code for script and converting to JS
- Making commits and pushing updates
- Deploying for presentation

### Tools:
- Balsamiq for creating a design to work from (an important step that saved me time)
- Postman for testing out API URLs before using them
- PhpStorm IDE for coding
- Chrome developer console for debugging
- GitHub for version control
- Vercel for publishing the finished product

### Results:

- index.html (main job search results page)
- jobs.js (script for index.html)
- saved.html (saved jobs page)
- saved.js (script for loading locally saved jobs)

Since the USAJOBS database contains nearly all government related jobs, there aren't very 
many search results.  For this reason, I decided to "show all" jobs instead of only those 
within the last 48 hours.  If a past date is selected, all jobs posted from that
day forward are then displayed. The USAJOBS API does not allow for searching *between*
dates, only within a specified number of days.  Finally, only saved jobs are shown on the saved jobs
page, since the most recent 10 are viewable on the main page.
