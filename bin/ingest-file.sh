#!env zsh

source bin/curl_rest.sh
source bin/functions.sh

ensure_SRV

if [[ $1 = "-d" ]];then
    DEBUG_FLAG=1
    file=$2
else
    file=$1
fi

if [ $DEBUG_FLAG ];then
    POST $SRV/file -F file=@$file
    exit
fi

file_location_line=$(POST $SRV/file -F file=@$file 2>&1| grep 'Location: ' |sed 's///')
file_uri=$(echo $file_location_line | grep -o 'http.*')
echo $file_uri
