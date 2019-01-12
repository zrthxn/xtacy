# XTACY Website
### v0.0.1

### How to Run
1. Install Node (from nodejs.org).
2. Open a terminal this repo's folder.
3. Say the magic words...
```
npm install
```

4. Wait. Its happening.
5. Say the other magic spell...
```
npm start
```

6. And then go to http://xtacy.org:3000

### Pushing and Pulling
**DO NOT** push to master. Make a branch with your FIRST NAME, or just fork this repo, and make changes and then submit a PR.

### Virtual Host
Since we are using a package called vhost, short for virtual host, which resolves the incoming requests based on host names, we need to first 
add the following lines to our HOSTS file, so that we can use the domain name as an alias for our local IP address and use the vhost feature.

Find your hosts file by going to
```
Windows > System32 > drivers > etc > hosts
```

Find your local IPv4 address by opening cmd and run **ipconfig**. Lets say the IP is 192.168.0.101

Add the following lines there
```
192.168.0.101       xtacy.org
192.168.0.101       www.xtacy.org
192.168.0.101       cdn.xtacy.org
192.168.0.101       api.xtacy.org
```
One line for each subdomain being used. Save the file and go to http://xtacy.org:3000

## File Types
### ALL IMAGE FILES IN PNG, NO EXCEPTIONS

## Events
### How to add an event
Everything related to events is dynamic so you wont actually have to change the code to add an event.
Follow the steps and test the event before publishing
1. Add the event to the Lookup Table ('eventLookup.json'). Make sure you follow the schema.
   Events must have an event type
   - '*com*' for competitive (paid and non paid)
   - '*tic*' for non-competitive paid (ticketed)
   - '*gen*' for general
   After deciding the event type, fill in all the fields and decide an event ID
   - The event ID can be anything, but it is recommended to keep a 6 byte **descriptive** ID
   - The event ID MUST be lowercase in the event lookup file

2. Every event has a main page (content) and a promo page. Add these in the respective folders
   - **The name of the file must be the same as the event ID**
   - The file must be an HTML file
   - *Promo* files should not contain any action elements

3. Add the event to the events page as a banner and the link to "#eventId" where event ID is the event's ID
4. A developer must be consulted before publishing an event
5. Commit, push and send a pull request.
   

## Security
#### CSRF Tokens
We are using Express Handlebars here. If you dont know what that is, please read about it. It's basically a very very basic version of React.
Now, every page is programmed to generate a CSRF key-token pair and this key-token pair is sent to the database. Then the server is told that
this action has been performed and the server **validates** the tokens sent by the webpage against those in the DB. If they match, the user is
allowed to continue. If not, they are given a warning about this.

Every page is programmed to send the tokens (stored in Local Storage) for verification when it opens.

Also, there are a few extra "fake" tokens generated to prevent an attacker from immidiately seeing which values are the CSRF tokens.