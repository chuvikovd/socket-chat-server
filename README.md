# socket-chat-server

## Usage

Rename `.env.sample` to `.env`

Then:

```bash
yarn
yarn build
yarn start
```

## Features & Tech stack

- written in `typescript`
- `express`
- `ws` for websocket communication
- `yup` for validation
- `winston` as logger

App has one route `/login?username=`, which validates provided username and responds with `200` if success, `403` if username already taken or `400` if validation failed.

App also has `ws://` for websocket communication, which is available after successful login attempt. 