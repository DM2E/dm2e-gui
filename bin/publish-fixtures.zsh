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


echoe() {
    echo "#- $@"1>&2;
}

##
## FIXME this will break if dm2e-ws repo is not in the parent directory
## TODO metadata
#
publishFile() {
    file=$1
    file_counter=$((file_counter + 1))
    file_uploaded=$(zsh bin/ingest-file.sh $file)
    echoe "uploaded $file as $file_uploaded"
    echo "FILE$file_counter='$file'"
}

boilerplate_url="http://localhost:9998/api"


publishWorkflow() {
    wf_counter=$((wf_counter + 1))
    wf_file=$1
    wf=$(mktemp)
    tempfile=$(mktemp)

    cat $wf_file \
        | sed "s!http://localhost:9998/api!$SRV!g"\
        > $wf

    echoe "----------------------"
    echoe "WORKFLOW: $wf"

    WORKFLOW=$(POST -H $CT_JSON $SRV/workflow -d @$wf \
        2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
    echo "WORKFLOW$wf_counter='$WORKFLOW'"

    echoe "get empty config"
    GETJ $WORKFLOW/blankConfig 2>/dev/null | sed 's/bottles of beer on the wall/flailing piglets/' > $tempfile
    sed -i '/^{/a \
        "http://purl.org/dc/terms/creator":"http://omnom.hu-berlin.de/api/user/command-line",
    ' $tempfile

    echoe "persist it"
    CONFIG=$(POST -H $CT_JSON $SRV/config -d @$tempfile \
        2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
    echo "CONFIG='$CONFIG'"

    echoe "run a job"
    JOB=$(PUT "-H$CT_TEXT" "$WORKFLOW" -d "$CONFIG" \
        2>&1 | grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
    echo "JOB='$JOB'"
}

file_counter=0;
wf_counter=0;

publishFile ../dm2e-ws/src/test/resources/mappings/xslt/KBA_BBAW_TO_EDM.xsl
publishFile ../dm2e-ws/src/test/resources/provider-examples/dta/grimm_meistergesang_1811.TEI-P5.xml
publishFile ../dm2e-ws/src/test/resources/mappings/xslt-zip/TEI2DM2E_xslt_20130605.zip

publishWorkflow src/main/resources/test-fixtures/demo-workflow.json
publishWorkflow src/main/resources/test-fixtures/xslt-publish-workflow.json
publishWorkflow src/main/resources/test-fixtures/xsltzip-publish-workflow.json

