#!env zsh
#
source bin/curl_rest.sh
source bin/functions.sh

ensure_SRV

if [[ $1 = "-d" ]];then
    DEBUG_FLAG=true
fi

grep_location() {
    curl_response=$1
    # echo $1
    loc=$(echo $curl_response|grep 'Location: ' | sed 's///' | grep 'Location' | grep -o 'http.*')
    if [ "x$loc" = "x" ];then
        die $1
    fi
    echo $loc
}

##
## FIXME this will break if dm2e-ws repo is not in the parent directory
## TODO metadata
#
publishFile() {
    file=$1
    file_counter=$((file_counter + 1))
    # if [ $DEBUG_FLAG ];then 
    #     file_uploaded=$(zsh bin/ingest-file.sh -d $file)
    # else
        file_uploaded=$(zsh bin/ingest-file.sh $file)
    # fi
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

    WORKFLOW=$(grep_location "$(POST -H $CT_JSON $SRV/workflow -d @$wf 2>&1)")
    echo "WORKFLOW$wf_counter='$WORKFLOW'"

    echoe "get empty config"
    WORKFLOW_EXEC=$(echo $WORKFLOW|sed 's@/workflow@/exec/workflow@')
    if [ $DEBUG_FLAG ];then
        configResp=$(GETJ $WORKFLOW_EXEC/blankConfig)
        echo $configResp
    fi
    configResp=$(GETJ $WORKFLOW_EXEC/blankConfig 2>/dev/null | sed 's/bottles of beer on the wall/flailing piglets/')
    echo $configResp > $tempfile
    sed -i '/^{/a \
        "http://purl.org/dc/terms/creator":"http://omnom.hu-berlin.de/api/user/command-line",
    ' $tempfile

    echoe "persist it"
    CONFIG=$(grep_location "$(POST -H $CT_JSON $SRV/config -d @$tempfile 2>&1)")
    echo "CONFIG='$CONFIG'"

    echoe "run a job"
    JOB=$(grep_location "$(PUT -H $CT_TEXT $WORKFLOW_EXEC -d $CONFIG 2>&1)")
    echo "JOB='$JOB'"
}

file_counter=0;
wf_counter=0;

publishFile ../dm2e-ws/src/test/resources/mappings/xslt/KBA_BBAW_TO_EDM.xsl
publishFile ../dm2e-ws/src/test/resources/provider-examples/dta/grimm_meistergesang_1811.TEI-P5.xml
publishFile ../dm2e-ws/src/test/resources/mappings/xslt-zip/TEI2DM2E_xslt_20130605.zip
publishFile ../dm2e-ws/src/test/resources/provider-examples/dta/grimm_meistergesang_1811.TEI-P5.xml.zip

publishWorkflow src/main/resources/test-fixtures/demo-workflow.json
publishWorkflow src/main/resources/test-fixtures/xslt-publish-workflow.json
publishWorkflow src/main/resources/test-fixtures/xsltzip-publish-workflow.json
publishWorkflow src/main/resources/test-fixtures/zipiterator-xsltzip-publish-workflow.json

