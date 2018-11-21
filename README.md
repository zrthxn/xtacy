# XTACY Website

### How to Run
1. Install Node (from nodejs.org). Have it? Congrats.
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

6. And then go to http://localhost:3000

### Pushing and Pulling ;)
Please please please dont push to master. Make a branch with your FIRST NAME, or just fork this repo, and make changes and then submit a PR to daddy.

## Security
#### CSRF Tokens
We are using Express Handlebars here. If you dont know what that is, please read about it. It's basically a very very basic version of React.
Now, every page is programmed to generate a CSRF key-token pair and this key-token pair is sent to the database. Then the server is told that
this action has been performed and the server **validates** the tokens sent by the webpage against those in the DB. If they match, the user is
allowed to continue. If not, they are given a warning about this.

Every page is programmed to send the tokens (stored in Local Storage) for verification when it opens.

Also, there are a few extra "fake" tokens generated to prevent an attacker from immidiately seeing which values are the CSRF tokens.