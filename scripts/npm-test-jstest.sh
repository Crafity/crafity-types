#!/bin/bash
$ScriptDir/npm-jslint.sh
export ErrorCode=$?
if [ "0" != "$ErrorCode" ]; then
	exit $ErrorCode
fi

node ./test/package.test.js
export ErrorCode=$?
if [ "0" != "$ErrorCode" ]; then
	export FailedTest=1
fi
node ./test/crafity.types.test.js
export ErrorCode=$?
if [ "0" != "$ErrorCode" ]; then
	export FailedTest=1
fi
exit $FailedTest
