# Darity

## Inspiration
Our team was inspired by the success of humorous viral videos since the internet's inception. In the Summer of 2014, the ALS Ice Bucket Challenge tasked Facebook users across the globe with pouring a bucket of ice over their heads for charity. The campaign was incredibly successful, raising over $115M in just one summer.

The concept of the ALS Ice Bucket Challenge encouraged participants to engage with their social networks, and have fun while supporting a charitable cause. We decided to create Darity as a means to spark this same behavior across the country. At Darity, however, users have the power to request the specific dares they would like to see and support them with charitable donations.

## What it does
At Darity, we turn your foolhardy moments into ways to positively support your community. It starts with creators suggesting and promoting dares through monetary backing. If the daredevil of choice decides to accept the challenge, he performs the dare and uploads a video of his actions through the platform. The money accumulated in support of the dare goes directly to a charity of the daredevil's choice. Darity allows devils and creators alike to make an impact on causes near them, all while laughing with (at) people at home and around the country.

When users first visit Darity, they log in using their Facebook account. After joining, users consult our tailored recommendation engine to find other dares to support. Users can promote the platform and spread their dares out to their networks through a custom tweet with integrated Twitter support.

## How we built it
Express and Firebase for the backend. We also created a separate backend using Flask so that Ayan could write a recommendation engine in Python while the rest of the project was in Javascript. We integrated login through Facebook, and sharing via Facebook and Twitter. We used the charity-navigator API to gather data about approved charities across the world. The device webcam was used to take videos of completed dares. These uploads were then saved onto our server for verification. We used Stripe for donation payment processing.

## Challenges we ran into
Gathering initial data for the recommendation engine was a challenge. We overcame the issue by sending out surveys to students across campus and recording their preferences towards different dares and causes. This sample data gives users a positive first experience on Darity.

## Accomplishments that we're proud of
We're proud that...

We were able to build a fully-responsive web application in just 24 hours.

Even with a wide range of experience across the team, each member contributed to a solid aspect of the project and felt valued!

## What we learned
It was Ayan's first time working with API's and writing scripts to gather data! He also learned about writing recommendation engines and using flask as well.

Vinesh and Rakesh learned about the woes of excessive Soylent consumption. They also learned not to trust chart.js!

## What's next for Darity
We'd love to reach out to big personality celebrities who want to support charities of their choice in a fun way. Watching Chance the Rapper drink a bottle of tabasco sauce to raise money for Chicago Public Schools would be an incredible way to fundraise and spread awareness on a national scale.

## Built With
flask
glitch
python
facebook-login-api
javascript
react-native
charity-navigator
twitter
firebase
multer
bulma
