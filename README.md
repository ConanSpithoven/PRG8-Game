# Piano Hero
A typescript version of the piano hero game that was made for Schouwburgplein.

De game werkt momenteel niet om de volgende redenen:
<ul>
  <li>VSC wil het project niet builden(alhoewel compilen zonder problemen verloopt).</li>
  <li>es6-shim niet werkt(Promise word niet herkent)</li>
</ul>

# forked Game
https://github.com/HarisSpahija/bomberman

## Pull Request:
https://github.com/HarisSpahija/bomberman/pull/1

## Feedback:
----

## UML
Game incomplete

## Singleton
De 'Game' en de 'SongSelector' zijn Singletons, omdat:
<ul>
  <li>Er hoeft nooit meer dan een game te zijn, omdat de speler maar een spel speelt.</li>
  <li>Er hoeft maar een song selectie lijst te zijn, omdat deze maar een keer gebruikt word</li>
</ul>

## Polymorfisme:
!MISSING!
de 'Note' wordt onderverdeeld in vier kleuren, deze vallen allemaal op hun eigen knop en hebben hun eigen punt waarde
!MISSING!

## Strategy
het interface 'NoteController' wordt geimplementeerd door 'NoteHitController' en 'NoteHitStreakController'.
deze bepalen hoe de 'Note' gespeeld hoort te worden door de speler.

##Observer
'Note' is een observer van het level, het level geeft hier aan de observer door wanneer de note over een knop is(playable).
