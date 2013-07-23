#!/bin/bash
cd tomcat
bash bin/catalina.sh stop
sleep 2
bash bin/catalina.sh start
