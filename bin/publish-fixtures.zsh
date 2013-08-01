#!env zsh

tempfile=$(mktemp)
workflow_file=$(mktemp)

source bin/curl_rest.sh

cat src/main/resources/test-fixtures/demo-workflow.json > $workflow_file

die() {
	echo $1 | boxes -d nuke
	exit 128
}

if [ -z "$SRV" ];then
	die "Must set SRV to base path of omnom api (e.g. export SRV='http://localhost:9998/api')";
fi


boilerplate_url="http://localhost:9998/api"
if [ "$SRV" != "$boilerplate_url" ];then
    echo "Replacing... $boilerplate_url with $SRV"
    sed -i "s!http://localhost:9998/api!$SRV!" $workflow_file
fi


# post workflow
WORKFLOW=$(POST -H $CT_JSON $SRV/workflow -d @$workflow_file \
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
