#!/bin/sh

NEW_PACKAGE="${1}"
NEW_TITLE="${2}"
DIRECTORY="${3}"

ORIGINAL_PACKAGE="com.example.nickj.test"
ORIGINAL_TITLE="Positron"

ORIGINAL_PACKAGE_PATH="${ORIGINAL_PACKAGE//\.//}"
NEW_PACKAGE_PATH="${NEW_PACKAGE//\.//}"
ORIGINAL_PACKAGE_REGEX="${ORIGINAL_PACKAGE//\./\\.}"

cd "${DIRECTORY}"
for FILE in app/{build.gradle,src/main/{AndroidManifest.xml,/java/${ORIGINAL_PACKAGE_PATH}/MainActivity.java,res/layout/activity_main.xml}}; do
  TMPFILE=$(mktemp tmp.XXXXXXXXXX)
  cp ${FILE} ${TMPFILE}
  cat ${TMPFILE} | sed -e "/${ORIGINAL_PACKAGE_REGEX}/s/${ORIGINAL_PACKAGE_REGEX}/${NEW_PACKAGE//\//\\/}/" > ${FILE}
  rm ${TMPFILE}
done
FILE="app/src/main/res/values/strings.xml"
TMPFILE=$(mktemp tmp.XXXXXXXXXX)
cp ${FILE} ${TMPFILE}
cat ${TMPFILE} | sed -e "/${ORIGINAL_TITLE}/s/${ORIGINAL_TITLE}/${NEW_TITLE//\//\\/}/" > ${FILE}
rm ${TMPFILE}
mkdir -p $(dirname app/src/main/java/${NEW_PACKAGE_PATH})
mv app/src/main/java/{${ORIGINAL_PACKAGE_PATH},${NEW_PACKAGE_PATH}}
cd - >/dev/null
