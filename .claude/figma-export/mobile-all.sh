#!/bin/bash
# Export every mobile screen (390) into Figma import frames m-<key>.
HIDE="(()=>{const s=document.createElement('style');s.textContent='.mobile-bar{display:none!important}';document.head.appendChild(s);return 1})()"
LOCK="const s=document.createElement('style');s.textContent='.mobile-bar{display:none!important}html,body{height:844px!important;overflow:hidden!important}';document.head.appendChild(s);"
POPUP="(async()=>{${LOCK} window.dispatchEvent(new CustomEvent('bavys:book',{detail:{}}));await new Promise(r=>setTimeout(r,800));document.activeElement&&document.activeElement.blur();return 1})()"
MENU="(async()=>{${LOCK} document.querySelector('.menu-btn').click();await new Promise(r=>setTimeout(r,800));document.activeElement&&document.activeElement.blur();return 1})()"
x=800
run() { node headless-extract.mjs "$1" "dump-m-$2" 390 "$3" | cut -c1-120 && node build.mjs $x 37000 "m-$2" "$4" "dump-m-$2.json" 2>&1 | grep -E "^root|Error"; x=$((x+600)); }
(python3 receiver.py > /dev/null 2>&1 &) ; sleep 1
run /games games "$HIDE" "Каталог ігор — 390"
run /games/velyka-dzhenga game "$HIDE" "Сторінка гри — 390"
run /gallery gallery "$HIDE" "Галерея — 390"
run /blog blog "$HIDE" "Блог — 390"
run /blog/yak-obraty-igry-dlia-vesillia article "$HIDE" "Стаття — 390"
run /about about "$HIDE" "Про нас — 390"
run /contacts contacts "$HIDE" "Контакти — 390"
run /nope 404 "$HIDE" "404 — 390"
run / menu "$MENU" "Меню — 390"
run / popup "$POPUP" "Попап бронювання — 390"
for p in $(lsof -t -iTCP:8799 -sTCP:LISTEN); do kill $p; done
