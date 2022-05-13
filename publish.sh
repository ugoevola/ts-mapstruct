#!/bin/bash
tsc
npm -f unpublish
npm publish --access public