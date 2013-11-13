#!env bash
oldpwd=$PWD

mvn_install() {
    mvn -o -Dmaven.test.skip -Dmaven.javadoc.skip=true -DskipTests -Djacoco.skip=true install
}
mvn_compile() {
    mvn -o -Dmaven.test.skip -Dmaven.javadoc.skip=true -DskipTests -Djacoco.skip=true compile
}
cd ../grafeo
    mvn_install
cd ../dm2e-ws
    mvn_install
cd $oldpwd
    mvn_compile
