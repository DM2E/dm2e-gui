dm2e-gui
========

Frontend webapp of OmNom including deployable tomcat/josso/fuseki setup

Bundles:
* Tomcat 7.0.42
* Fuseki 0.2.7
* JOSSO Tomcat Agent 1.8.7
* dm2e-ws 1.0-SNAPSHOT

Build Process
-------------

```
  bash bin/download-assets.sh all
  mvn package
```

Result is in target/dm2e-gui-deploy.zip

Installation
------------
```
  unzip dm2e-gui-deploy.zip
  cd dm2e-gui-deploy
  bash bin/verify-install        # fix all files mentioned here
  bash bin/start-fuseki.sh       # to start fuseki, otherwise, adapt src/main/resources/dm2e.gui.properties accordingly
  bash bin/start-tomcat.sh       # to start the tomcat server containing the GUI
```
