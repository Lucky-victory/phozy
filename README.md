# phozy-api
A Photo sharing API built with NodeJS, Typescript and PlanetScale DB

## How to use 
clone the repo `git clone https://github.com/Lucky-victory/phozy-api.git`

move into the directory `cd phozy-api`

copy the `.env.example`
`cp .env.example .env`

fill in the following fields
```shell
DATABASE_URL=  // your planetscale db url 
JWT_SECRET_KEY
CLOUDINARY_URL= // ypur cloudinary url
```
then install dependencies, initialized  the database and start the server
```shell
npm install
npm run db:init
npm run start
```
### Routes
General route `/api`

Sign up route `/api/sign-up`

Sign in route `/api/sign-in`

User's route `/api/profile`

Album's route `/api/profile`

Photos's route `/api/photos`

Likes route `/api/likes`
