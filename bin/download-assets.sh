#!/bin/bash
ARG1=$1

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR=$SCRIPT_DIR/..
ASSETS_DIR=$BASE_DIR/assets
VENDOR_DIR=$BASE_DIR/src/main/webapp/vendor

DOWNLOAD_CMD="curl -L -J -O"


info_download() {
    tool=$1
    version=$2
    url=$3
    target=$4
    echo "Downloading '$tool'"
    echo "  Version: $version"
    echo "  From: $url"
    echo "  To: $target"
}

download_JOSSO() {
    cd $ASSETS_DIR
    JOSSO_VERSION=$(cat $BASE_DIR/pom.xml | grep -Po 'version.josso>\K.*(?=<)')
    JOSSO_URL="http://sourceforge.net/projects/josso/files/JOSSO/JOSSO-${JOSSO_VERSION}/josso-${JOSSO_VERSION}.zip/download"
    info_download josso $JOSSO_VERSION $JOSSO_URL $ASSETS_DIR
    $DOWNLOAD_CMD $JOSSO_URL
}
download_TOMCAT() {
    cd $ASSETS_DIR
    TOMCAT_VERSION=$(cat $BASE_DIR/pom.xml | grep -Po 'version.tomcat>\K.*(?=<)')
    TOMCAT_URL="http://ftp.halifax.rwth-aachen.de/apache/tomcat/tomcat-7/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.zip"
    info_download tomcat $TOMCAT_VERSION $TOMCAT_URL $ASSETS_DIR
    $DOWNLOAD_CMD $TOMCAT_URL
}
download_SESAME() {
    cd $ASSETS_DIR
    SESAME_VERSION=$(cat $BASE_DIR/pom.xml | grep -Po 'version.sesame>\K.*(?=<)')
    SESAME_URL="http://search.maven.org/remotecontent?filepath=org/openrdf/sesame/sesame-http-server/${SESAME_VERSION}/sesame-http-server-${SESAME_VERSION}.war"
    info_download sesame $SESAME_VERSION $SESAME_URL $ASSETS_DIR
    $DOWNLOAD_CMD $SESAME_URL
}
download_FUSEKI() {
    cd $ASSETS_DIR
    FUSEKI_VERSION=$(cat $BASE_DIR/pom.xml | grep -Po 'version.fuseki>\K.*(?=<)')
    FUSEKI_URL="http://www.apache.org/dist/jena/binaries/jena-fuseki-${FUSEKI_VERSION}-distribution.zip"
    info_download sesame $FUSEKI_VERSION $FUSEKI_URL $ASSETS_DIR
    $DOWNLOAD_CMD $FUSEKI_URL
}
download_BOWER_DEPS() {
    cd $ASSETS_DIR
    BOWER_DEPS_REPO="https://github.com/kba/dm2e-gui-bower-deps.git"
    info_download sesame "latest" $BOWER_DEPS_REPO $ASSETS_DIR
    rm -fr $ASSETS_DIR/bower-deps
    rm -fr $VENDOR_DIR
    git clone --depth 1 $BOWER_DEPS_REPO $ASSETS_DIR/bower-deps
    mkdir -p $VENDOR_DIR
    cp -r $ASSETS_DIR/bower-deps/vendor/* $VENDOR_DIR
    cp $ASSETS_DIR/.gitignore $VENDOR_DIR
}

if [ "$ARG1" = 'josso' ];then
    download_JOSSO
elif [ "$ARG1" = 'tomcat' ];then
    download_TOMCAT
# elif [ "$ARG1" = 'sesame' ];then
    # download_SESAME
elif [ "$ARG1" = 'fuseki' ];then
    download_FUSEKI
elif [ "$ARG1" = 'bower-deps' ];then
    download_BOWER_DEPS
elif [ "$ARG1" = 'all' ];then
    download_TOMCAT
    download_JOSSO
    download_FUSEKI
    download_BOWER_DEPS
    # download_SESAME
else
    echo "Usage: "
    echo "  $0 (tomcat|josso|fuseki|sesame|all)"
fi
