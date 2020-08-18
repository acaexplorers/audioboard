# Vocabulary Exchange

```
Maintainer: IJustDev
Email: getintouch@royalzsoftware.de
GitHub: https://github.com/IJustDev
```

## Usage
### Run migrations
There are SQL files that auto create tables that are required for the app to run properly.

They are located under `./migrations/` run them in chronological beginning with the script `initial.sql`.

### Development Run 
```sh
$ cd ./src && node app.js
```

### Production with Docker 
```sh
$ docker build -t ijustdev/vocabulary-exchage .
```

```sh
$ docker run --name vocabulary-exchange -p 3000:3000 ijustdev/vocabulary-exchange
```

### Verify installation 
```sh
$ curl http://localhost:3000/login
```

Or just open your browser and navigate to `http://localhost:3000`
