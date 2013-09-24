#!env bash

# Load config
source deploy.profile.sh

appname=dm2e-gui-deploy

base_deploy_dir=$HOME/deploy
deploy_dir=$base_deploy_dir/$appname
repos_dir=$HOME/dm2e-repos

message() {
	echo $1 | boxes -d ada-box
}

die() {
	echo $1 | boxes -d nuke
	exit 128
}

sanity_check() {
	for repo in dm2e-ws dm2e-gui;do
		if [ ! -d $repos_dir/$repo ];then
			die "$repo is not $repos_dir/$repo"
		fi
	done
}
stop_servers() {
	cd $deploy_dir;
	bash bin/stop-fuseki.sh
	bash bin/stop-tomcat.sh
}
start_servers() {
	cd $deploy_dir
	bash bin/start-fuseki.sh
	bash bin/start-tomcat.sh
}

undeploy() {
	message "Undeploying"
	cd $base_deploy_dir
	mv $deploy_dir $deploy_dir.$(date '+%s')
}

rebuild_dm2e_ws() {
	message "Rebuilding and installing dm2e_ws"
	cd $repos_dir/dm2e-ws
	git pull
	mvn -q -o -DskipTests install
}
rebuild_dm2e_gui() {
	message "Rebuilding and packaging dm2e_gui"
	cd $repos_dir/dm2e-gui
	git pull
    bin/download-assets.sh bower-deps
    mvn -o -q clean
	mvn -o -q -DskipTests package
	cp target/$appname.zip $base_deploy_dir/$appname.zip
}
unpack() {
	message "Deploying server"
	cd $base_deploy_dir
	unzip $appname.zip
}
setup() {
    message "Running setup.sh"
    cd $deploy_dir
    bash bin/setup.sh
}


#=------- MAIN ---------=#
#=          			=#
#=----------------------=#

sanity_check

rebuild_dm2e_ws
rebuild_dm2e_gui

if [ -d $deploy_dir ];then
	stop_servers
    sleep 5
	undeploy
fi

unpack
setup
start_servers
