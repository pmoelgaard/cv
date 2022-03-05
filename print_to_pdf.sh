#!/bin/sh

#@echo off
echo ######################################################################

echo "CONVERTING:";

echo "Target: index.html";
echo "Destination: Peter Andreas Moelgaard CV 2021";

pagedjs-cli "index-en.html" -o "Peter Andreas Moelgaard CV 2022 - EN.pdf";
pagedjs-cli "index-dk.html" -o "Peter Andreas Moelgaard CV 2022 - DK.pdf";
