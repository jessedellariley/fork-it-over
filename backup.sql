Create Table users
(
	id SERIAL PRIMARY KEY,
	username varchar(40) NOT NULL,
	password varchar(100),
	authenticated boolean,
	artist_id varchar(50)
)

Create Table artists
(
	id SERIAL PRIMARY KEY,
	artist_id varchar(40) NOT NULL,
	user_id integer(10) NOT NULL
)