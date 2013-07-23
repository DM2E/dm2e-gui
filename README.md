dm2e-gui
========

Frontend webapp of OmNom including deployable tomcat/josso/fuseki setup

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
  bash bin/start-fuseki.sh
  bash bin/start-tomcat.sh
```
