#!/bin/bash

echo "🛑 Provádím poslední zálohu MongoDB..."
docker compose exec mongo-backup /backup.sh

echo "📦 Vypínám kontejnery..."
docker compose down
