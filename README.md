# 3dapp

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).




export const API_ROOT = (process.env.NODE_ENV === 'production')
			? 'http://wall-dev.71an.com'
			:'http://wall-dev.71an.com'

export const CookieDomain = (process.env.NODE_ENV === 'production')
			? '.71an.com'
			:'.71an.com'

export const User_Center=(process.env.NODE_ENV === 'production')
	? 'http://wall-dev.71an.com'
	:'http://wall-dev.71an.com'

export const WallUrl=(process.env.NODE_ENV === 'production')
	? 'http://wall-dev.71an.com/wall/index.html'
	:'http://wall-dev.71an.com/wall/index.html'


 