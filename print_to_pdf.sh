#!/bin/sh

@echo off
echo ######################################################################

echo "CONVERTING:";

echo "Target: index.html";
echo "Destination: Peter Andreas Moelgaard CV 2021";

pagedjs-cli "index.html" -o "Peter Andreas Moelgaard CV 2021.pdf";