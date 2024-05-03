# Web-application for fake (random) user data generation.

The single app page allows to:
1) select region (USA, Serbia, India)
2) specify the number of errors per record (two “linked” controls — slider 0..10 + binded number field with max value limit at least 1000)
3) define seed value and Random button to generate a random seed

If the user changes anything, the table below automatically updates.

It supports infinite scrolling in the table (shows 20 records and if the user scrolls down,10 records are added below).

## Link to hosted site

https://random-user-generator-tan.vercel.app/

Note: If infinite scrolling does not work for you try resizing the window to a smaller size

## Link to video demo

https://youtu.be/ugVVBLbR808

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

