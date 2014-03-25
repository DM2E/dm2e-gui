#!env bash

# source $HOME/deploy.profile.sh

REQUIRED_VARS="
DM2E_JOSSO_LOGIN
DM2E_JOSSO_LOGOUT
DM2E_JOSSO_HOST
DM2E_HOSTNAME
DM2E_BASE_URI
DM2E_PORT
DM2E_LOCALPORT
DM2E_SPARQL_ENDPOINT_QUERY
DM2E_SPARQL_ENDPOINT_UPDATE
DM2E_TDB_DIR
DM2E_MONGO_CONNECTION_STRING
MINT_USERNAME
MINT_PASSWORD
JAVA_HOME"
for var in ${REQUIRED_VARS[@]};do
    if [ -z "${!var}" ];then
        echo "Required variable '$var' not set!"
        exitflag="exit"
    fi
done
if [ ! -z "$exitflag" ];then
    exit;
fi

replace_and_move() {
    src=$1
    targetdir=$2
    targetfile=$targetdir/$(basename $1|sed 's/\.template$//')

    if [ ! -f $src ];then
        echo "PACKAGE ERROR: $src does not exist!"
        exit 1;
    fi
    if [ ! -d $targetdir ];then
        echo "PACKAGE ERROR: $targetdir does not exist!"
        exit 1;
    fi
    
    echo "Patching $targetfile with $src"

    cp $src $targetfile
    
    for var in ${REQUIRED_VARS[@]};do
        sed -i "s|\\$\\$\\\$${var}\\$\\$\\$|${!var}|g" $targetfile
    done
    echo "  -> DONE"
}

replace_and_move templates/dm2e-ws.local.properties.template tomcat/webapps/ROOT/WEB-INF/classes
replace_and_move templates/josso-agent-config.xml.template tomcat/lib
replace_and_move templates/server.xml.template  tomcat/conf
replace_and_move templates/setenv.sh.template tomcat/bin
