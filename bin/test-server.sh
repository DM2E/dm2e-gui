#!/bin/bash
# mvn -q -o exec:java \
    # -Dlogging.properties.main-file="logging.console.properties" \
    # -Dlogging.properties.main=/home/kb/Dropbox/workspace/dm2e-ws/target/classes/logging.properties \
mvn -o compile
mvn -q -o exec:java \
    -Dlogback.configurationFile="logback-console.xml" \
    -Dexec.mainClass.override="eu.dm2e.gui.GuiConsole"
