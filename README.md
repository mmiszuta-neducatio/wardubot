# wardubot
slack bot for polish discount store: biedronka

go to project directory and

**before** you will:
```docker-compose up```

open docker-compose.yml and provide your credentials for both slack bot and cloudinary as environment variables:
```    
environment:
  - SLACKBOT_TOKEN=
  - CLOUDINARY_NAME=
  - CLOUDINARY_KEY=
  - CLOUDINARY_SECRET=
```

you will find slack token on your team Apps & Integrations page
for Cloudinary you need to copy paste them from your profile page (it's visible on the dashboard)

then you can:
```docker-compose up -d```

and on slack you will see what to buy in biedronka for good prices!
happy shopping!
