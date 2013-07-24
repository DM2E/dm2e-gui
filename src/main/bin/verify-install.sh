#!env bash
filelist=$(find . -type f -and \
    '(' \
           -regex '.*properties$' \
       -or -regex '.*sh$' \
       -or -regex '.*template$' \
       -or -regex '.*xml$' \
   ')' \
   -and '!' -regex '.*verify-install.sh$' \
   -exec grep -li 'CHANGE_ME' '{}' ';')
no_of_files=$(echo $filelist|wc -w)
echo $no_of_files
if [ $no_of_files != 0 ];then
    echo 'WARNING: The following files need to be adapted to the setup:'
    for f in $(echo $filelist);do
        echo "    * $f"
    done
else
    echo "Everything seems to be ready"
fi


# grep -l 'CHANGE_ME' **/*properties
