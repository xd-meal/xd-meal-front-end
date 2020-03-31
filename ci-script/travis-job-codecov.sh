#!/usr/bin/env bash
npm run test:unit || exit 1
codecov ./test/unit/coverage/clover.xml
