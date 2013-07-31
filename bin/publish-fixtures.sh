#!env zsh

tempfile=$(mktemp)

source bin/curl_rest.sh
SRV="http://localhost:9998/api"

# post workflow
WORKFLOW=$(POST -H $CT_JSON $SRV/workflow -d @src/main/resources/test-fixtures/demo-workflow.json \
    2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')

# get empty config
GETJ $WORKFLOW/blankConfig 2>/dev/null | sed 's/bottles of beer on the wall/flailing piglets/' > $tempfile

# persist it
CONFIG=$(POST -H $CT_JSON $SRV/config -d @$tempfile \
    2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')

# run a job
# echo POST -H "$CT_TEXT" "$WORKFLOW" -d "$CONFIG"
# PUT "-H$CT_TEXT" "$WORKFLOW" -d "$CONFIG"
JOB=$(PUT "-H$CT_TEXT" "$WORKFLOW" -d "$CONFIG" \
    2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')

echo "WORKFLOW='$WORKFLOW'"
echo "CONFIG='$CONFIG'"
echo "JOB='$JOB'"
