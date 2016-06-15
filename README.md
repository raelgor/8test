### 8test
THE place to find tweets.

#### Installation
Depending on your node version, you may need `--harmony`.
```sh
git clone https://github.com/raelgor/8test
cd 8test
npm i
node main -h localhost -p 8080 -k <twitter_key> -s <twitter_secret>
```

#### Test
```sh
npm i -g mocha
mocha test/all.js --noout -h localhost -p 8080 -k <twitter_key> -s <twitter_secret>
```
