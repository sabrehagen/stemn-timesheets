#!/bin/bash

pre="not post"
post="not pre"
alreadyRunning=`ps aux | grep timesheet.js | grep -v grep | wc -l`

if [ $alreadyRunning -gt 0 ]
then
  exit 0
fi

while [ "$pre" != "$post" ]
do
  pre=`tail -c 50 /tmp/test.log`
  sleep 2
  post=`tail -c 50 /tmp/test.log`
done

DISPLAY=:0.0 xfce4-terminal -x sh -c "node /home/jackson/repositories/timesheets/timesheet.js"
