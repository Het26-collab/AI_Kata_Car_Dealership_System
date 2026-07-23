#!/bin/bash
git filter-branch --env-filter '
    GIT_AUTHOR_NAME="Het26-collab"
    GIT_AUTHOR_EMAIL="Het26-collab@users.noreply.github.com"
    GIT_COMMITTER_NAME="Het26-collab"
    GIT_COMMITTER_EMAIL="Het26-collab@users.noreply.github.com"
    export GIT_AUTHOR_NAME GIT_AUTHOR_EMAIL GIT_COMMITTER_NAME GIT_COMMITTER_EMAIL
' -f HEAD
