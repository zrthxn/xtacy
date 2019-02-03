# XTACY Website
### v0.1.3 Beta

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
ALL IMAGE FILES IN PNG, NO EXCEPTIONS

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

3. Add the event to the events page as a banner and set the href to "#eventId" where eventId is the event's ID
4. Add a sheet to the registrations spreadsheet with the sheet name equal to the event ID in ALL CAPS
5. A developer must be consulted before publishing an event
6. Commit, push and send a pull request.
   

## Security
#### CSRF Tokens
Every time a page is opened it sends a GET request to the server, which programmed to generate a CSRF key-token pair and this key-token pair 
is sent to the database. Every time a POST request is made, this key token pair should be sent along with it. The server **validates** the tokens 
sent by the webpage against those in the DB. If they match, the user is allowed to continue. If not, a 403 (Forbidden) response is sent.

Also, there are a few extra "fake" tokens generated to prevent an attacker from immidiately seeing which values are the CSRF tokens.