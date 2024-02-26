## Tech Stack:

1. nodeJS (>=20.10.0)
2. express
3. pnpm

Note: Please use pnpm only.

## How to start:

1. check node version compatiblity from package.json
2. create `.env` file , by renaming `.env.sample` and re-write all required key values if required
3. To Execute Application run: `npm run dev`

## Health Check APIs:

- `/liveness`

# Api Curl

`curl --location 'http://localhost:8021/liveness'`

## Test Application

Run : `npm run test`

## Note

1. In Case pnpm-lock.yaml exist in repo then do `pnpm run build` else `pnpm run install` to install application dependencies.
2. By Default App runs on Port 8021 but can modified by changing value of `PORT` in .env file
