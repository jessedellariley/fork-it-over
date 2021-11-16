# Fork It Over

Fork It Over will find the best restaurants, sorted by highest Yelp ratings,
available for delivery by Uber Eats, DoorDash, Grubhub, or Postmates within
5-15 miles of user's address.

Visit <http://fork-it-over.herokuapp.com/>

## Deploying Locally

### Requirements

1. `npm install`
2. `pip install -r requirements.txt`

### Run Application

1. Run command in terminal (in your project directory): `npm run build`. This will update anything related to your `App.js` file (so `public/index.html`, any CSS you're pulling in, etc).
2. Run command in terminal (in your project directory): `python3 app.py`
3. Preview web page in browser 'localhost:8080/' (or whichever port you're using)

### Deploy to Heroku

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`
