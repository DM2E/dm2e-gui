#!env zsh

echoerr() { echo "$@" 1>&2; }

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


echoerr "# Replacing boilerplate URL with real URL"
boilerplate_url="http://localhost:9998/api"
if [ "$SRV" != "$boilerplate_url" ];then
    echo "Replacing... $boilerplate_url with $SRV"
    sed -i "s!http://localhost:9998/api!$SRV!" $workflow_file
fi

##
## FIXME this will break if dm2e-ws repo is not in the parent directory
## TODO metadata
echoerr "# publish some files"
FILE1=$(zsh bin/ingest-file.sh ../dm2e-ws/src/test/resources/mappings/xslt/KBA_BBAW_TO_EDM.xsl)
echo "FILE1='$FILE1'"
FILE2=$(zsh bin/ingest-file.sh ../dm2e-ws/src/test/resources/provider-examples/dta/grimm_meistergesang_1811.TEI-P5.xml)
echo "FILE2='$FILE2'"

echoerr "# post workflow"
WORKFLOW=$(POST -H $CT_JSON $SRV/workflow -d @$workflow_file \
    2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
echo "WORKFLOW='$WORKFLOW'"

echoerr "# get empty config"
GETJ $WORKFLOW/blankConfig 2>/dev/null | sed 's/bottles of beer on the wall/flailing piglets/' > $tempfile
sed -i '/^{/a \
"http://purl.org/dc/terms/creator":"http://omnom.hu-berlin.de/api/user/command-line",
' $tempfile


echoerr "# persist it"
CONFIG=$(POST -H $CT_JSON $SRV/config -d @$tempfile \
    2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
echo "CONFIG='$CONFIG'"

echoerr "# run a job"
# echo POST -H "$CT_TEXT" "$WORKFLOW" -d "$CONFIG"
# PUT "-H$CT_TEXT" "$WORKFLOW" -d "$CONFIG"
JOB=$(PUT "-H$CT_TEXT" "$WORKFLOW" -d "$CONFIG" \
    2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
echo "JOB='$JOB'"


echo $tempfile
