# Sprint 6 Overview

## "Problem"
Now in addition to fetching, displaying and saving jobs data, and specifying a cut-off date, the job 
seeker..
- must login to access their "dashboard."
- will be shown jobs from multiple categories
- can filter results by category on the page
- can mail a job to a friend
  
Begin on 7/26 and deliver by 8/6

## Solution
### Method:

This updated version of the web applet was extended to retrieve results from more categories with a more
general search URL. Additional HTML & Javascript were written to expand the user interface and
functionality for filtering jobs from the more general pool of results, and so that links would be
available for emailing a job using 'mailto:friend@domain.com.'

Much time and consideration were given to figuring out how to solve the issue of coordinating the stored
data and the displayed data. While the applet may seem trivial, the goal was to fetch data from the server
only once per page, and then hold the data in such a way that we could accomplish subtractive filtering,
that is removing rows with each filter, as opposed to overwriting our table for each filter action.

In the end, I decided to make a copy of the data array which could be trimmed from the end for filtering
by date, revised to exclude entries for the other filters, and then restored if the user wants to
start over.  As elements are removed from the array so are the rows from the table.  While this method
and the specifics of the underlying logic may be overly complicated, it is satisfying to be able to use
the 3 filters together.

### Process: coding, committing progress, merging, and deploying

- Noting tasks on project board (and gradually checking them off)
- Designing the webpage(s) and user interface
- Writing HTML for base content and CSS for styling
- Writing pseudo code for script and converting to JS
- Making commits and pushing updates
- Deploying for presentation

### Tools:
- Balsamiq for creating a design to refer to (an important step that saved me time)
- PhpStorm IDE for coding
- Chrome developer console for debugging
- GitHub for version control
- Vercel for publishing the finished product

### Results:

CREATED:
- dashboard.html
- filter.js

UPDATED:
- index.html (showall job search results page)
- jobs.js (script for index.html) and moved a portion into showall.js
- saved.html (saved jobs page)
- saved.js (script for loading locally saved jobs)

As mentioned previously, since the USAJOBS database contains nearly all government related jobs, there
aren't very many search results, and there are hardly any specific results.  For this reason, I decided
to "show all" jobs instead of only those within the last 48 hours.  If a past date is selected, all jobs
posted from that day forward are then displayed.

The USAJOBS API does not allow for searching *between* dates, only within a specified number of days.
Finally, only saved jobs are shown on the saved jobs
page, since the most recent 10 are viewable on both the main page and the dashboard.
