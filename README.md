# [MARVEL character lookup](https://arjanvdmeij.github.io/msp-2-marvel-lookup/)

## Overview

### What is this website for?

This website was made to demonstrate the possibilities that data, retrieved using an API, can bring in enhancing content.
Being a life-long Marvel fan, I decided to do this using Marvel's API, and allow people to search characters, and then present:
- Comics the character appeared in
- Series the character appeared in
- Events they appeared in
- If available, a character description
- A link to the character's bio-page at marvel.comics

### What does it do?

Searching and submitting a character's name will connect to the Marvel API to get the basic information for the character.
Once returned, additional information is automatically gathered using follow-up calls:
- Comics covers for the character, sorted from new to old, in a first page of a total X
- Series, linking back to their marvel.com counterpart, with an image and if available, description
- An overview of all events the character took part in, providing a description and link back to marvel.com

Once this additional information is gathered and processed, each section will allow paging, which will get the next set of data in that section.
Different sections retrieve different amounts of data, in order to limit the time taken.

### How does it work

The search bar will autocomplete to ensure correct name searches. This is done using a list that was created by gathering
all possible characters and storing those in a json format in-script. Due to its length (1491 entries), the autocomplete function was put in a separate 
file in order to maintain a readable main file.

Whenever an incorrect (unfound) search is submitted, a message will pop up, and the search can be done again. The auto-complete is sufficiently clear however, the fall-back is a proper 'it could happen' option.
Once a name is submitted, an ajax call to Marvel is used to get the information needed.

Given the asynchronous nature of ajax calls, I have opted to create separate re-usable functions performing the calls.
The first one handles gathering the basic character information used to present an image, name, description, link to a bio page and totals for comics, series and events.
The functions after are triggered initially from this function. These are three separate functions, each fed with a collectionURI, as well as an offset value. 
The functions can be re-triggered from the pagination, updating the section with next or previous data.

An overlay is placed onto the page upon execution of a search, and is lifted upon completion. 
The overlay may be lifted before all sections are filled, this is done to ensure users don't wait longer than needed.
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
- Galleries for images retrieved if related in groups (comics and series)
- Links to the matching pages for results at marvel.com

### Features Left to Implement
- Optionally allow selection of a specific time frame to get information for
- Extended information when clicking on (e.g.) events, using further API calls with:
  - character information
  - Comics information (release date, price, link to buy/read)

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

## Wireframe and User Stories
- In the root of the repository is a document with stories and mockup drawings (though crude, they turned out more or less as envisioned)

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
