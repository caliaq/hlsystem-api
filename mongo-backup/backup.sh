#!/bin/bash
TIMESTAMP=$(date +%F-%T)
BACKUP_DIR="/backup/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
mongodump --host mongo --out "$BACKUP_DIR"
echo "Záloha hotová: $BACKUP_DIR"
chmod +x mongo-backup/backup.sh
