# Fork It Over

Fork It Over will find the best restaurants, sorted by highest Yelp ratings,
available for delivery by Uber Eats, DoorDash, Grubhub, or Postmates within
a given radius of user's address.

Visit <https://forkitover.herokuapp.com/>

## Deploying Locally

### Requirements

1. `npm install`
2. `pip install -r requirements.txt`
3. For Mac users: `brew install postgresql`
4. For VM/Ubuntu/WSL users: `sudo apt install postgresql`

### APIs

1. Sign up to get a Yelp API key at <https://www.yelp.com/developers/documentation/v3/business_search>. Add your API key as an environment variable named `YELP_API_KEY`.
2. Sign up to get a Google Custom Search JSON API at <https://developers.google.com/custom-search/v1/overview>. Add your API key as an environment variable named `CUSTOM_SEARCH_KEY1`.

### Deploy to Heroku

You'll need to create your Heroku app and database before you're able to run the app.

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Create your database: `heroku addons:create heroku-postgresql:hobby-dev`
4. Get the name of your database from `heroku config` and add `DATABASE_URL` as an environment variable of the same name.
4. Push to Heroku: `git push heroku main`

### Run Application

1. Run command in terminal (in your project directory): `npm run build`. This will update anything related to your `App.js` file (so `public/index.html`, any CSS you're pulling in, etc).
2. Run command in terminal (in your project directory): `python3 app.py`
3. Preview web page in browser 'localhost:8081/' (or whichever port you're using)
