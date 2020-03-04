#!/usr/bin/env bash
npm run test:unit
codecov ./test/unit/coverage/clover.xml
