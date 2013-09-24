#!/bin/bash
echo "Starting fuseki"
cd fuseki
export FUSEKI_ARGS="--port 9997 --update --loc=$DM2E_TDB_DIR /test"
bash fuseki start
