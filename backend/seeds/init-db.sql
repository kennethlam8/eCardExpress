create database pj3;

\c pj3;

--create email checking
/* CREATE EXTENSION citext;
CREATE DOMAIN email AS citext
    CHECK(
    VALUE ~ '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
); */
/* 
-- create table
create table users(
    id serial primary key,    
    email VARCHAR(60) not null UNIQUE, --email email not null UNIQUE,
    first_name varchar(60) not null,
    last_name varchar(60) not null,
    password varchar(60) not null,
    created_at timestamp without time zone,
    updated_at timestamp without time zone 
);

create table user_cards(
    id serial primary key,    
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users (id), 
    card_image text,
    qrcode_image text,
    first_name varchar(60) not null,
    last_name varchar(60) not null,
    title varchar(60) not null,
    sector varchar(60),
    company_name varchar(255) not null,
    address text,
    email varchar(60),
    website text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone 
);

create table user_cardholders(
    id serial primary key,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users (id), 
    card_stored INTEGER not null,
    FOREIGN KEY (card_stored) REFERENCES user_cards (id), 
    created_at timestamp without time zone
);

create table events(
    id serial primary key,
    name varchar(255) not null,
    organiser varchar(255) not null,
    host_id INTEGER not null,
    FOREIGN KEY (host_id) REFERENCES users (id), 
    date DATE not null,
    time TIME,
    status varchar(60) default 'notstarted',
    address varchar(255),
    website varchar(255),
    estimated_participant INTEGER,
    created_at timestamp without time zone
);

create table event_participants(
    id serial primary key,
    event_id INTEGER not null,
    FOREIGN KEY (event_id) REFERENCES events (id),
    participant_id INTEGER not null,
    FOREIGN KEY (participant_id) REFERENCES users (id)  
);

create table telephones(
    id serial primary key,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users (id),
    tel_number INTEGER not null,
    country_code INTEGER DEFAULT 852,
    category varchar(255) DEFAULT "work"
);
 */
/* -- checking samples
-- correct examples
SELECT 'abcd@gmail.com'::email; 
SELECT 'mysite@ourearth.com'::email;
SELECT 'my.ownsite@ourearth.org'::email;
SELECT 'mysite@you.me.net'::email;
SELECT 'admin@yahoo.com.hk'::email;

-- error examples
SELECT 'mysite.ourearth.com'::email; 
SELECT 'mysite@.com.my'::email; 
SELECT '@you.me.net'::email; 
SELECT 'mysite123@gmail.b'::email; 
SELECT 'mysite@.org.org'::email; 
SELECT '.mysite@mysite.org'::email;
SELECT 'mysite()*@gmail.com'::email;
SELECT 'mysite..1234@yahoo.com'::email; 
SELECT 'abcd@efg.info'::email;   */