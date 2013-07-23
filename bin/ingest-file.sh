#!env zsh

source bin/curl_rest.sh

file=$1

# POST $SRV/file -F file=@$file
file_location_line=$(POST $SRV/file -F file=@$file 2>&1| grep 'Location: ' |sed 's///')
file_uri=$(echo $file_location_line | grep -o 'http.*')
echo $file_uri
