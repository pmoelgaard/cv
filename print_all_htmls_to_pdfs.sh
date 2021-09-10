#!/bin/sh

@echo off
echo ######################################################################

for i in *.html ; do
	echo "CONVERTING:";

	echo "Target: " $i;
	echo "Destination: " $i | sed -e "s/.html/.pdf/";

	DESTINATION=$i | sed -e "s/.html/.pdf/"

	pagedjs-cli $i -o $DESTINATION;
done