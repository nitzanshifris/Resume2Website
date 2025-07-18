#!/bin/bash
cd "/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/generated_portfolios/dev-user-123_baaccb9f-cb47-499c-8833-1a106b8dc3f1"
PORT=4000 npm run dev > portfolio.log 2>&1 &
echo $! > portfolio.pid
echo "Portfolio server started on port 4000"
