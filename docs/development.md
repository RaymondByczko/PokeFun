# Development

## Purpose

This document will discuss various aspects in the coding
challenge.  That file is 'Coding Challenge_Parallel.docx'.
Challenge fullfillment, Requirements, given endpoints, and
developed points are covered.

### Challenge Fullfillment

This is a node.js application written with the expressjs
framework.  Accordingly, challenge fullfillment can
be met with a) a REST json call b) serving a browser HTML
page.  (The REST json call can be brought up in a
browser too, since its a GET HTTP operation.)

The server is hosted in replit.com, and the author
controls lunarrays.com.  This challenge fullfillment
is at:

pokedex.lunarrays.com

The required info, 'return all of this info in one object',
can be observed with the following REST GET call:

pokedex.lunarrays.com/pokemon/transformaveragecombo/1-5

Other ranges can be substituted.  Instead of '1-5', try
'3-9' for example. Coding defensively, invalid substitutions
will not work. Things like '5-1', or 'one-five'.

Other pieces of the solution can be observed at other URLs.
See 'Developed Endpoints' in this markdown file.

### Given Endpoints

Given endpoints are the ones utilized by this software
service.  They are not developed by this agent.  Those
that are provided by this agent are 'Developed Endpoints'.
At times, a developed endpoint can utilize given endpoints
to provide its own resource.

The endpoints are five in total, but can be generalized.
They are of the form: https://pokeapi.co/api/v2/pokemon/1

Each endpoint returns a json structure that is called a 'Pokemon'.
Since this term might lead to confusion, the data structure is also
called the 'Pokemon Data Structure'.

The Pokemon Data Structure can be quite extensive.
pokemon1 returns somelike like over 10k lines when the
json is formatted nicely.  However, there is a limited number
of keys.  For an initial analysis of the Pokemon Data
Structure, see Appendix 1.

Notice that the second from last component in the endpoint
is 'pokemon'.  The last component is a resource identifier,
and is a number (an integer).

#### Code

To access this, the javascript functions are named after
these two components.

1. pokemon1 - proof of concept for particular endpoint ending with
    
2. pokemon1details - proof of concept with some details.

3. pokemon(n) - more generalized than above.

### Developed Endpoints

This expressjs application provides certain endpoints
which are outlined here.

- pokemon/full/:pokemondId - provides the full json object for
the pokemon with resource id of :pokemonId
  
- pokemon/slice/:pokemondId - provides a slice, or portion, of the full json
pokemon object.  One or more high level keys are maintained, and the
  rest are discarded in the slicing.
  
- pokemon/transform/:pokemonId - after a slice is taken, data within
is rearranged to meet a certain transform requirement.
  
- pokemon/transform/:fromPokemonId-:toPokemonId - a slice is taken
from each pokemon resource in the range given for their ids. Each slice is
transformed.  After transformation, each slice is a json object.
The objects are then stored in an array, alphabetically according
to the name key of each object stored in the array.
  
- /pokemon/averagestat/:fromPokemonId-:toPokemonId - pokemon resources
from the range indicated are each processed, by slicing and then transformation. The result
  
is then processed, for each transformation, noticing each and every stat.  An average
for each stat is computed.  The end result of this endpoint is an array of
json object.  Each json object has two keys, name and stat.  Stat is the average value
for the stat indicated by name.
  
@TODO replace pokemon with pokefun

### Storage of Pokemon Data Structure

PSDs are stored in a javascript array, where each
element is a transform of the PSD.  This means that only
a section of the entire PSD is stored as one element.

Each element that is stored is called 'Transformed Pokeman Data Structure' 
(TPDS).  The entire PDS is not stored as an element.  Only
a small piece of it is stored.  Further, in storing it,
it is rearranged.

## Appendix 1 - Analysis of Pokemon Data Structure

pokemon1 was utilized in this applications router
in a pug based gui.  Here are some observations
- 10471 lines
- at the top part of the structure there are 18 key value pairs
- some of the keys at the top are: abilities, base_experience, species,
and sprites
  
- top keys of interest are: name, stats.  The remaining are ignored.
- key value sizes. Value size is number of lines.

| key | Value Size |
|-----|------------|
|abilities|18|
|base_experience|1|
|forms|6|
|game_indices|142|
|height|1|
|held_items|1|
|id|1|
|is_default|1|
|location_area_encounters|1|
|moves|10064|
|name|1|
|order|1|
|paste_types|1|
|species|4|
|sprites|159|
|stats|50|
|types|16|
|weight|1|

- note that the keys of interest, name and stats, are very limited

## Appendix 2 - Javascript modules

Javascript functions written for this coding challenge
can be shared between the server and the browser
client, with some caveats.

The main issue is that commonjs modules are used on the
server, by node.js .  These are not usable in their
commonjs form (so to say), from within the browser.
The browser requires ecmascript modules.  What is one
to do?

The difference between the two worlds is how functions
etc are exported.  The mechanism for exporting is at the
end of the file.  This leads to a solution.

Two different 'ending' files are maintained.  One
for commonjs and one for ecmascript.  An ending file
is appended to a 'base' file, to produce a resultant
file useful in that world.

The base and ending files are located in jsprivate.
They are concatenated in a npm script and stored
in jspublic.  So far, a make file type dependency
based on timestamp is ignored.  The proper module
files are produced every time.  But at least its
a start, and allows less version control effort.

