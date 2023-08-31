#!/bin/bash

npm run build

mv dist ./mz-json

zip -q -r -o mz-json.zip mz-json

echo "\n\033[32m package generated!  \033[0m"
