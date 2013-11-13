#!/bin/bash
die() {
	echo $1 | boxes -d nuke
	exit 128
}

ensure_SRV() {
    if [[ "x$SRV" = "x" ]];then
        die "Must set \$SRV  [e.g. '\$SRV=http://localhost:9998/api']"
    fi
}

echoe() {
    echo "#- $@"1>&2;
}
