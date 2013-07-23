#!/bin/bash
cd fuseki
export FUSEKI_ARGS="--port 9997 --update --mem /test"
bash fuseki start
