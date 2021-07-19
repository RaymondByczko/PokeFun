# Development

## Purpose

This document will discuss various requirements in the coding
challenge.  That file is 'Coding Challenge_Parallel.docx'.

### Endpoints

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




