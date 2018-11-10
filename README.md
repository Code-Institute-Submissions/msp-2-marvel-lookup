# [MARVEL character lookup](https://arjanvdmeij.github.io/msp-2-marvel-lookup/)

## Overview

### What is this website for?

This website was made to demonstrate the possibilities that data, retrieved using an API, can bring in enhancing content.
Being a life-long Marvel fan, I decided to do this using Marvel's API, and allow people to search characters, and then present:
- Comics the character appeared in in 2018
- Series the character appeared in in 2018
- Events they appeared in
- If available, a character description
- A link to the character's bio-page at marvel.comics
- See images for other characters that were in series and events alongside them

### What does it do?

Searching and submitting a character's name will connect to the Marvel API to get the basic information for the character.
Once returned, additional information is automatically gathered using follow-up calls:
- Comics covers for the year 2018 for the character
- Series for the year 2018, linking back to their marvel.com counterpart
- An overview of all events the character took part in, providing a description and link back to marvel.com

Once this additional information is gathered and processed, for each series and event found, the other characters that were part of those are sought, 
and images for them are shown along the series and events they belong to.

### How does it work

The search bar will autocomplete to ensure correct name searches. This is done using a list that was created by gathering
all possible characters and storing those in a json format in-script. Due to its length (1491 entries), the autocomplete function was put in a separate 
file in order to maintain a readable main file.

Whenever an incorrect (unfound) search is submitted, a message will pop up, and the search can be done again. The auto-complete is sufficiently clear however, the fall-back is a proper 'it could happen' option.
Once a name is submitted, using the Marvel API, ajax is used to get the information needed.

Given the asynchronous nature of ajax calls, a total of three functions cover the entire processing of requests.
The first one handles gathering the basic character information used to present an image, name, description, link to a bio page and totals for comics, series and events.
The second function is then fed the character's id, and is triggered for the retrieval of comics, series and events. These are three separate calls, passing the parameter which to go and get. Based on the parameter given, results are then processed accordingly, populating the three different topics onto the page.
During execution of processing the results for the series and events, a third and final function is triggered, being fed the parameter for series or events, as well as the id of the series or event being processed. Results for each execution are then processed to populate the page with further information.

An overlay is placed onto the page upon execution of the initial search, and is lifted upon completion of either the comics or series retrieval. 
Retrieving all the events takes longer to execute and process, and delaying the user any longer than needed should be prevented.
While the overlay is lifted however, a progress indicator will show which data is still being retrieved/processed. Once done, the button associated will be cleared and usable.

The site relies heavily on the [MARVEL API](https://developer.marvel.com), any and all character content retrieved is © 2018 MARVEL
The code used is mostly based on **jQuery**, version 3.3.1
This site is styled using [Materialize](https://materializecss.com), version 1.0.0
Pop-up images making use of [Lightbox](https://lokeshdhakar.com/projects/lightbox2/)
The site can be viewed [HERE](https://arjanvdmeij.github.io/msp-2-marvel-lookup/)

## Features

### Existing Features
- Clear opening message with some explanation and current limitations
- Fully functional auto-complete providing small character icons when available
- (Temporary) overlay indicating processing of data
- Galleries for images retrieved if related in groups (comics, series, events, characters for series or events)
- Links to the matching pages for results at marvel.com

### Features Left to Implement
- Modifying code to get comics for the past year based on submit date (essentially: today minus one year)
  - Alternatively, re-design the form and ask the user for a year (t.b.d.)
- Extended information when clicking on (e.g.) events, using further API calls with:
  - character information (beyond an image gallery)
  - Comics information (release date, price, link to buy/read)
  - Added information for events beyond a link-back to the Marvel site

## Tech Used

### Technologies and outside sources:
- **HTML**, **CSS**, **jQuery** / **Javascript**
- [Materialize](http://materializecss.com/) version 1.0.0
  - Used to give the site a simple, responsive layout
- [JQuery](https://jquery.com) version 3.3.1
  - Used for pretty much everything, including Materialize
  - API calls using ajax GET requests
  - processing responses to usable content
  - Filling and creating the HTML content
- [Lightbox](https://lokeshdhakar.com/projects/lightbox2/)
- [Stack Overflow](https://stackoverflow.com/)

## Wireframe mockups

## Testing
- Testing was entirely done by continuous testing of every step created
  - initial HTML page with just placeholders
  - create call function with fixed character
  - process data onto page placeholders
  - expand code and page continuously making calls and updating characters used
  - make modifications to the HTML (both file and generated) and immediately run test call
  - create custom error handling once an error occurs
  - ensure searches are always valid, reducing errors to server side errors only and handle those
  
- Testing was done on the following browsers:
  - Safari
  - Google Chrome
  
- Mobile device testing was done:
  - Using Chrome's developer tools, emulating all available formats
  - iPhone 7+
    - iOS Safari
    - iOS Opera
    - iOS Chrome
  - iPad Air2
    - iOS Safari
    - iOS Opera
    - iOS Chrome

### Media and Information
- Data provided by Marvel. © 2018 MARVEL
  - Page background found through Google
  - 'Image not available' replacement  and logo created by me
