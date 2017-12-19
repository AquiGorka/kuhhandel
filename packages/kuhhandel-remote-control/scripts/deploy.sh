#!/usr/bin/env bash

gem install dpl

dpl --provider=gcs --access-key-id=$GCS_ACCESS_KEY_ID --secret-access-key=$GCS_SECRET_ACCESS_KEY --bucket=emoji-trade-remote.got-game.net --local-dir=dist --acl=public-read --skip-cleanup
