#!/bin/bash

listOfLESS=(
src/main/webapp/css/theme-dark
src/main/webapp/css/theme-light
);
for i in ${listOfLESS[@]};do
    lessc ${i}.less > ${i}.css;
done
