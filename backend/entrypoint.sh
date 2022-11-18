#!/bin/sh
 
echo "Start Sever (entry_point)"
start=`date "+%Y-%m-%d"`
python3 manage.py migrate --noinput
echo "migrate..."
echo "starting time was `expr $start`. "
exec "$@"