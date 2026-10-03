# Cake knife / button icons / Word puzzle update

- Cake: removed the "any tap cuts the cake" fallback. After the last candle is blown the knife activates automatically; the cake is cut only by pressing and dragging the knife across it.
- Buttons: all buttons got a solid body, 3D edge, no hazy overlay and an icon (CSS mask, so editable text is untouched).
- Puzzle: any word (`puzzle.word`, 2-20 letters), one box per letter, automatic hint ({count}/{first}/{last} supported in custom hints).
- Editor: click any letter box/tile -> "Puzzle word" edit box. Next after the puzzle opens the "puzzle solved" page; badge, title, message ({name}/{word}) and Continue button are all editable.
