#!env zsh
#
source bin/curl_rest.sh

die() {
	echo $1 | boxes -d nuke
	exit 128
}

if [ -z "$SRV" ];then
	die "Must set SRV to base path of omnom api (e.g. export SRV='http://localhost:9998/api')";
fi


echoerr() {
    echo "$@" 1>&2;
}

##
## FIXME this will break if dm2e-ws repo is not in the parent directory
## TODO metadata
publishFiles() {
    echoerr "# publish some files"
    FILE1=$(zsh bin/ingest-file.sh ../dm2e-ws/src/test/resources/mappings/xslt/KBA_BBAW_TO_EDM.xsl)
    echo "FILE1='$FILE1'"
    FILE2=$(zsh bin/ingest-file.sh ../dm2e-ws/src/test/resources/provider-examples/dta/grimm_meistergesang_1811.TEI-P5.xml)
    echo "FILE2='$FILE2'"
}

boilerplate_url="http://localhost:9998/api"


publishWorkflow() {
    wf=$1

    echoerr "----------------------"
    echoerr "#"
    echoerr "# WORKFLOW: $wf"
    echoerr "#"

    WORKFLOW=$(POST -H $CT_JSON $SRV/workflow -d @$wf \
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
    JOB=$(PUT "-H$CT_TEXT" "$WORKFLOW" -d "$CONFIG" \
        2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
    echo "JOB='$JOB'"

    echoerr "# Replacing boilerplate URL with real URL"
    if [ "$SRV" != "$boilerplate_url" ];then
        echo "Replacing... $boilerplate_url with $SRV"
        sed -i "s!http://localhost:9998/api!$SRV!" $wf_demo
    fi
}

echoerr "# Create workflow tempfiles"
tempfile=$(mktemp)
wf_demo=$(mktemp)
wf_xslt_publish=$(mktemp)
cat src/main/resources/test-fixtures/demo-workflow.json > $wf_demo
cat src/main/resources/test-fixtures/xslt-publish-workflow.json > $wf_xslt_publish

publishWorkflow $wf_demo
publishWorkflow $wf_xslt_publish
