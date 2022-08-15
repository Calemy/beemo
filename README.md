# Beemo

a javascript osu!bancho implementation for lazer because i can't typescript

## Features

- Register & Login
- Score Submission
- Stats
- osu!direct
- Cross-Plattfrom support
- Global Leaderboard Ranking (Score)


## Roadmap

- Make all modes compatible
- Multiplayer
- Spectator
- Chat
- Calculate & Display ranks (partly done)
- Temporary pp system until a calculator gets updated/released
- Additional browser support / Frontend


## Screenshots

![Leaderboards](https://x.catboy.best/ERMntNX.jpg)

![Rankings](https://x.catboy.best/cbHUaGd.png)

![Profiles](https://x.catboy.best/xFmEY1e.png)

![Direct](https://x.catboy.best/5SsKSXn.png)


## Installation

This installation is required to have nginx and mongodb 6 installed.

This got tested with nodejs version 16.10

For a working certificate you need to be resposible at the moment.
You can always use tools like certbot or acme.sh

git clone the repository and edit the config

```bash
  git clone https://github.com/calemy/beemo
  cd beemo
  nano config.example.js
  mv config.example.js config.js
```

install all necessary dependencies using npm and start beemo using pm2

```bash
  npm install
  npm install -g pm2
  pm2 start index.js --name Beemo
```

Add something like this to your nginx config.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lemres.de;
    client_max_body_size 100M;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name lemres.de;
    client_max_body_size 100M;

    #Certificate pathes
    ssl_certificate /root/.acme.sh/lemres.de/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/lemres.de/lemres.de.key;
    ssl_trusted_certificate /root/.acme.sh/lemres.de/ca.cer;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://127.0.0.1:6969;    # default port is 6969
    }
}
```

Restart nginx

```bash
sudo service nginx restart
```


## Authors

- [@Calemy](https://www.github.com/calemy)

Feel free to join as contributor!

## FAQ

#### What modes are supported?

Currently i'm focusing on making it work for standard.
Other modes will most likely be added in the future.

#### When is this going to be done?
There is no guarantee that this is ever going to be finished,
but by the time lazer releases it might take aprox. another month or two.
Depending on the situation around this project.

#### Why is *insert issue here* not working?

It's still very early in development.

As for currently, i'm working alone on the project and therefore,
there might be things that are not done yet!

Additionally osu!lazer is not finished either
and might change a lot of things that might break the server.

#### Why are you using javascript and not *insert language here*?

Simply because i like javascript and feel comfortable enough
to write code this advanced in it. If you don't like it, it's not my problem
so deal with it. Also it's decently fast compared to languages like python.
Yes, even the node v8 runtime.
## Optimizations

With Version 1 that came with the code-refactor we achieved to make the code easier to
maintain to what was possible for us to reduce the code to without losing important stuff.


## Feedback

If you have any feedback, please reach out to us on the discord server.

https://discord.gg/JgpDZ4gaAs
