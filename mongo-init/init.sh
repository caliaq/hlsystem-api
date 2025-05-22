#!/bin/bash

echo "🧩 Čekám, než MongoDB naběhne..."
until mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
done

echo "✅ Mongo běží."

# Pokud složka data/db je prázdná (nová instance), zkusíme obnovit zálohu
if [ ! "$(ls -A /data/db)" ]; then
  echo "🔄 Obnovuji databázi z poslední zálohy..."

  LATEST_BACKUP=$(ls -td /backup/*/ | head -1)
  if [ -n "$LATEST_BACKUP" ]; then
    echo "📂 Načítám z: $LATEST_BACKUP"
    mongorestore --drop "$LATEST_BACKUP"
    echo "✅ Obnoveno ze zálohy."
  else
    echo "⚠️  Žádná záloha nenalezena, startuji s prázdnou databází."
  fi
else
  echo "📦 Data již existují, obnova není potřeba."
fi
