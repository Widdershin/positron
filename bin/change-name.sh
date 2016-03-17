#!/bin/sh

NEW_PACKAGE="${1}"
NEW_TITLE="${2}"
DIRECTORY="${3}"

ORIGINAL_PACKAGE="com.example.nickj.test"
ORIGINAL_TITLE="Positron"

ORIGINAL_PACKAGE_PATH="$(echo ${ORIGINAL_PACKAGE} | tr '.' '/')"
NEW_PACKAGE_PATH="$(echo ${NEW_PACKAGE} | tr '.' '/')"
ORIGINAL_PACKAGE_REGEX="$(echo ${ORIGINAL_PACKAGE} | sed -e 's/\./\\./g')"

NEW_PACKAGE_WITHOUT_SLASHES="$(echo ${NEW_PACKAGE} | sed -e 's!/!\\/!g')"
NEW_TITLE_WITHOUT_SLASHES="$(echo ${NEW_TITLE} | sed -e 's!/!/\\/!g')"

cd "${DIRECTORY}"
for FILE in app/build.gradle app/src/main/AndroidManifest.xml app/src/main/java/${ORIGINAL_PACKAGE_PATH}/MainActivity.java app/src/main/res/layout/activity_main.xml; do
  TMPFILE=$(mktemp tmp.XXXXXXXXXX)
  cp ${FILE} ${TMPFILE}
  cat ${TMPFILE} | sed -e "/${ORIGINAL_PACKAGE_REGEX}/s/${ORIGINAL_PACKAGE_REGEX}/${NEW_PACKAGE_WITHOUT_SLASHES}/" > ${FILE}
  rm ${TMPFILE}
done
FILE="app/src/main/res/values/strings.xml"
TMPFILE=$(mktemp tmp.XXXXXXXXXX)
cp ${FILE} ${TMPFILE}
cat ${TMPFILE} | sed -e "/${ORIGINAL_TITLE}/s/${ORIGINAL_TITLE}/${NEW_TITLE_WITHOUT_SLASHES}/" > ${FILE}
rm ${TMPFILE}
mkdir -p $(dirname app/src/main/java/${NEW_PACKAGE_PATH})
mv app/src/main/java/${ORIGINAL_PACKAGE_PATH} app/src/main/java/${NEW_PACKAGE_PATH}
cd - >/dev/null
