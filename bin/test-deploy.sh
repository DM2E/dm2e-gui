#!env bash

do_rsync() {
    rsync -rav --exclude='.idea' src/main/webapp/ IGNOREME/dm2e-gui-deploy/tomcat/temp/?-ROOT
    rsync -rav --exclude='.idea' src/main/webapp/ IGNOREME/dm2e-gui-deploy/tomcat/webapps/ROOT/
}

if [ "$1" = '-c' ];then
    echo "Continuous redeploy"
    while true; do
        inotifywait \
            -e create \
            -e modify \
            -e delete \
            -e close_write \
            -r src/main/webapp/templates \
            -r src/main/webapp/js
        do_rsync;
    done
else
    echo "rsyncing"
    do_rsync;
fi
