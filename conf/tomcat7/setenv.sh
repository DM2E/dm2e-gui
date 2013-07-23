JAVA_OPTS="$JAVA_OPTS -Djava.security.auth.login.config=$CATALINA_HOME/conf/jaas.conf"
JAVA_OPTS="$JAVA_OPTS -Ddm2e-ws.test.properties_file=dm2e.gui.properties"


# Enable the jconsole agent locally
# JAVA_OPTS="$JAVA_OPTS -Dcom.sun.management.jmxremote"

export JAVA_OPTS
