Presence
========
Presence records user attendance in [HipChat](https://www.hipchat.com/).

Data is recorded in 5 minute intervals in a `presence.csv` file with a unix timestamp, email and status:

    1411634343,mario@gmail.com,available
    1411634343,bower@gmail.com,offline
    1411634343,peach@gmail.com,away

Installation
------------
Presence runs on [node.js](http://nodejs.org/) and requires no further dependencies. Assuming node.js is installed, run:

    git clone https://github.com/fdb/presence.git
    cd presence
    export HIPCHAT_API_KEY="yourapikey"
    node app.js

