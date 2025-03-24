#!/bin/sh
ROOT=$2
echo "root $ROOT"

if [ $ROOT ] ; then
	cd ..
fi

/bin/sh -ec 'cd ./api && go build -o ../bin/codepush-server && \
echo executable file \"codepush-server\" saved in ../bin/codepush-server && \
cd .. && ./bin/codepush-server --env-path .env && $SHELL'