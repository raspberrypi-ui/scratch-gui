const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const fs = window.require('fs');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjU3MCIgaGVpZ2h0PSI3MjAiPgogPHBhdGggZD0ibSAxNTguMzc1LDEuNjU2MjUgYyAtMy42MTkzLDAuMTEyMzE5MiAtNy41MTcxNSwxLjQ0OTMyNjYgLTExLjkzNzUsNC45Mzc1IEMgMTM1LjYxMDU0LDIuNDE3NDQ5NiAxMjUuMTEwNDEsMC45NjY1NjEyIDExNS43MTg3NSw5LjQ2ODc1IDEwMS4yMjQ4OSw3LjU4Nzk5MjIgOTYuNTA4NDYxLDExLjQ2OTQ5NCA5Mi45Mzc1LDE2IDg5Ljc1NDk1MywxNS45MzQxMzUgNjkuMTE4NjUyLDEyLjcyNzkzIDU5LjY1NjI1LDI2Ljg0Mzc1IDM1Ljg3NDYwMiwyNC4wMzAzMjkgMjguMzU5NDcyLDQwLjgzMTYyNSAzNi44NzUsNTYuNSBjIC00Ljg1NjkxMSw3LjUxODk1NSAtOS44ODk1MDMsMTQuOTQ3MjI2IDEuNDY4NzUsMjkuMjgxMjUgLTQuMDE4MDA2LDcuOTgzNTE0IC0xLjUyNzQzMSwxNi42NDQwMyA3LjkzNzUsMjcuMTI1IC0yLjQ5Nzg1NywxMS4yMjI2IDIuNDEyMDc3LDE5LjE0MDg2IDExLjIxODc1LDI1LjMxMjUgLTEuNjQ3MDksMTUuMzU3NTYgMTQuMDgzNTA1LDI0LjI4NzQzIDE4Ljc4MTI1LDI3LjQ2ODc1IDEuODAzNjc3LDguOTQ4NjggNS41NjI5MSwxNy4zOTI3IDIzLjUzMTI1LDIyLjA2MjUgMi45NjMyMywxMy4zMzYxIDEzLjc2MjA2LDE1LjYzOTA2IDI0LjIxODc1LDE4LjQzNzUgLTM0LjU2MTkyOSwyMC4wODk1NCAtNjQuMjAwNjcsNDYuNTIyNjYgLTY0LDExMS4zNzUgbCAtNS4wNjI1LDkuMDMxMjUgQyAxNS4zMzc4ODIsMzUwLjY5NjA0IC0yMC4zMTY1NDcsNDI4LjE2MDAxIDM1LjQzNzUsNDkxLjEyNSBjIDMuNjQxODcxLDE5LjcwODM4IDkuNzQ5NTg5LDMzLjg2Mzk2IDE1LjE4NzUsNDkuNTMxMjUgOC4xMzM4MzQsNjMuMTMwNTggNjEuMjE3NjMsOTIuNjkxNjEgNzUuMjE4NzUsOTYuMTg3NSAyMC41MTY1MywxNS42MjgxMiA0Mi4zNjgxOCwzMC40NTY3MiA3MS45Mzc1LDQwLjg0Mzc1IDI3Ljg3NTE1LDI4Ljc0OTQ2IDU4LjA3Mzg4LDM5LjcwNjQgODguNDM3NSwzOS42ODc1IDAuNDQ1MTUsLTIuOGUtNCAwLjg5ODUzLDAuMDA1IDEuMzQzNzUsMCAzMC4zNjM2MywwLjAxODkgNjAuNTYyMzUsLTEwLjkzODA0IDg4LjQzNzUsLTM5LjY4NzUgMjkuNTY5MzIsLTEwLjM4NzAzIDUxLjQyMDk3LC0yNS4yMTU2MyA3MS45Mzc1LC00MC44NDM3NSAxNC4wMDExMiwtMy40OTU4OSA2Ny4wODQ5MiwtMzMuMDU2OTIgNzUuMjE4NzUsLTk2LjE4NzUgNS40Mzc5MSwtMTUuNjY3MjkgMTEuNTQ1NjIsLTI5LjgyMjg3IDE1LjE4NzUsLTQ5LjUzMTI1IDU1Ljc1NDA0LC02Mi45NjQ5OSAyMC4wOTk2MSwtMTQwLjQyODk2IC0xOS41MzEyNSwtMTY0LjUzMTI1IEwgNTEzLjc1LDMxNy41NjI1IGMgMC4yMDA2NywtNjQuODUyMzQgLTI5LjQzODA3LC05MS4yODU0NiAtNjQsLTExMS4zNzUgMTAuNDU2NjksLTIuNzk4NDQgMjEuMjU1NTIsLTUuMTAxNCAyNC4yMTg3NSwtMTguNDM3NSAxNy45NjgzNCwtNC42Njk4IDIxLjcyNzU4LC0xMy4xMTM4MiAyMy41MzEyNSwtMjIuMDYyNSA0LjY5Nzc1LC0zLjE4MTMyIDIwLjQyODM0LC0xMi4xMTExOSAxOC43ODEyNSwtMjcuNDY4NzUgOC44MDY2OCwtNi4xNzE2NCAxMy43MTY2MSwtMTQuMDg5OSAxMS4yMTg3NSwtMjUuMzEyNSA5LjQ2NDk0LC0xMC40ODA5NyAxMS45NTU1LC0xOS4xNDE0ODcgNy45Mzc1LC0yNy4xMjUgQyA1NDYuNzk1NzUsNzEuNDQ3MjI2IDU0MS43NjMxNiw2NC4wMTg5NTUgNTM2LjkwNjI1LDU2LjUgNTQ1LjQyMTc4LDQwLjgzMTYyNSA1MzcuOTA2NjUsMjQuMDMwMzI5IDUxNC4xMjUsMjYuODQzNzUgNTA0LjY2MjYsMTIuNzI3OTMgNDg0LjAyNjMsMTUuOTM0MTM1IDQ4MC44NDM3NSwxNiA0NzcuMjcyNzksMTEuNDY5NDk0IDQ3Mi41NTYzNiw3LjU4Nzk5MiA0NTguMDYyNSw5LjQ2ODc1IDQ0OC42NzA4NCwwLjk2NjU2MTMyIDQzOC4xNzA3MSwyLjQxNzQ1IDQyNy4zNDM3NSw2LjU5Mzc1IDQxNC40ODQ1NSwtMy41NTM2NjMxIDQwNS45NzE0OSw0LjU4MDQ1NCAzOTYuMjUsNy42NTYyNSAzODAuNjc2MTUsMi41Njg0NzIgMzc3LjExNjk4LDkuNTM3MTU3OCAzNjkuNDY4NzUsMTIuMzc1IDM1Mi40OTM1LDguNzg2OTIzOCAzNDcuMzMzMTUsMTYuNTk4NTMyIDMzOS4xODc1LDI0Ljg0Mzc1IGwgLTkuNDY4NzUsLTAuMTg3NSBjIC0yNS42MTA1NCwxNS4wOTMxMTUgLTM4LjMzMzc4LDQ1LjgyNTUwMSAtNDIuODQzNzUsNjEuNjI1IC00LjUxMjA2LC0xNS44MDE5NzkgLTE3LjIwNjQ3LC00Ni41MzQ1NDIgLTQyLjgxMjUsLTYxLjYyNSBsIC05LjQ2ODc1LDAuMTg3NSBDIDIyNi40NDgxLDE2LjU5ODUzMiAyMjEuMjg3NzUsOC43ODY5MjM1IDIwNC4zMTI1LDEyLjM3NSAxOTYuNjY0MjcsOS41MzcxNTgzIDE5My4xMDUxLDIuNTY4NDcyOSAxNzcuNTMxMjUsNy42NTYyNSBjIC02LjM3OTczLC0yLjAxODQ5MTEgLTEyLjI0NjY3LC02LjIxNDQyNzYgLTE5LjE1NjI1LC02IHoiIHN0eWxlPSJmaWxsOiMwMDAwMDAiIC8+CiA8cGF0aCBkPSJtIDEwNy4zOTE4NCw2OC4wNTU1ODMgYyA2Ny45NDc2NywzNS4wMzEzNTcgMTA3LjQ0Njg5LDYzLjM2ODk2NyAxMjkuMDg3MTcsODcuNTA0NDY3IC0xMS4wODIzNSw0NC40MTc1OSAtNjguODk2MzgsNDYuNDQ0NjQgLTkwLjAzNTU5LDQ1LjE5ODU4IDQuMzI4NDIsLTIuMDE0NzQgNy45Mzk4OCwtNC40Mjc3OCA5LjIyMDUxLC04LjEzNTc0IC01LjMwNDQ5LC0zLjc2OTgxIC0yNC4xMTI4OSwtMC4zOTcxOSAtMzcuMjQzNjMsLTcuNzc0MTYgNS4wNDQwNywtMS4wNDQ5OSA3LjQwMzQ4LC0yLjA2MzAyIDkuNzYyODksLTUuNzg1NDIgLTEyLjQwNTcxLC0zLjk1NjcgLTI1Ljc2ODYyLC03LjM2NjQyIC0zMy42Mjc3NDYsLTEzLjkyMTE2IDQuMjQxMjUzLDAuMDUyNCA4LjIwMTE1NiwwLjk0ODggMTMuNzQwMzY2LC0yLjg5MjcxIC0xMS4xMTE2OTQsLTUuOTg4MTkgLTIyLjk2OTEwOCwtMTAuNzMzNTEgLTMyLjE4MTM5LC0xOS44ODczOCA1Ljc0NTIxMywtMC4xNDA2MyAxMS45Mzk0NTIsLTAuMDU2OCAxMy43NDAzNzEsLTIuMTY5NTMgLTEwLjE3MDQ0LC02LjMwMDY4IC0xOC43NTEyNDIsLTEzLjMwNzg3IC0yNS44NTM1OTIsLTIwLjk3MjE1IDguMDM5OTc5LDAuOTcwNTIgMTEuNDM1Mjg0LDAuMTM0NzggMTMuMzc4NzgyLC0xLjI2NTU2IC03LjY4Nzc5NSwtNy44NzQxOSAtMTcuNDE3NTU5LC0xNC41MjMxOSAtMjIuMDU2OTExLC0yNC4yMjY0NCA1Ljk2OTYwNiwyLjA1NzQ4NCAxMS40MzEyNDksMi44NDUwNiAxNS4zNjc1MiwtMC4xODA3OTUgLTIuNjEyMzY1LC01Ljg5MzQ1MyAtMTMuODA1NDEzLC05LjM2OTYxOCAtMjAuMjQ4OTY3LC0yMy4xNDE2NzYgNi4yODQzNTksMC42MDkzNzcgMTIuOTQ5NjA2LDEuMzcxMTA4IDE0LjI4Mjc1MywwIEMgNjEuODAyMDY4LDU4LjUxNzM0NiA1Ni43OTY5MTksNTEuODM1ODg1IDUxLjg4Nzk3OCw0NC45MTM5MDYgNjUuMzM4MDIxLDQ0LjcxNDE3NyA4NS43MTU3MzQsNDQuOTY2MjUzIDg0Ljc5MjU0OSw0My44MjkxNCBsIC04LjMxNjU0LC04LjQ5NzMzNSBjIDEzLjEzNzYxNywtMy41MzcyNDEgMjYuNTgwNjUxLDAuNTY4MTY0IDM2LjMzOTY2MSwzLjYxNTg4NyA0LjM4MTg2LC0zLjQ1NzY4MSAtMC4wNzc2LC03LjgyOTk4IC01LjQyMzgzLC0xMi4yOTQwMTUgMTEuMTY0OTYsMS40OTA2NDYgMjEuMjUzODIsNC4wNTczODkgMzAuMzczNDUsNy41OTMzNjIgNC44NzIzOCwtNC4zOTkzMjkgLTMuMTYzODksLTguNzk4NjU4IC03LjA1MDk4LC0xMy4xOTc5ODcgMTcuMjQ5MzYsMy4yNzI1NjggMjQuNTU3MTYsNy44NzA2OCAzMS44MTk4MSwxMi40NzQ4MSA1LjI2OTM1LC01LjA1MDc5OSAwLjMwMTY2LC05LjM0MzI5OSAtMy4yNTQzLC0xMy43NDAzNzEgMTMuMDA1NjYsNC44MTcwNDggMTkuNzA0NzgsMTEuMDM1NTUxIDI2Ljc1NzU2LDE3LjE3NTQ2MyAyLjM5MTE5LC0zLjIyNzA1MyA2LjA3NDk0LC01LjU5MjQwOCAxLjYyNzE1LC0xMy4zNzg3ODEgOS4yMzQxNiw1LjMyMjcyNSAxNi4xODkyNiwxMS41OTUwNiAyMS4zMzM3NCwxOC42MjE4MTcgNS43MTMzNiwtMy42Mzc5NDEgMy40MDM4NywtOC42MTMwMjMgMy40MzUwOSwtMTMuMTk3OTg3IDkuNTk2NjUsNy44MDY1MTYgMTUuNjg2ODcsMTYuMTEzOTUgMjMuMTQxNjgsMjQuMjI2NDQzIDEuNTAxNjksLTEuMDkzNDM3IDIuODE2NjEsLTQuODAxNzEgMy45Nzc0NywtMTAuNjY2ODY3IDIyLjg5NTM5LDIyLjIxMTgxNSA1NS4yNDU5MSw3OC4xNTgyNDEgOC4zMTY1NCwxMDAuMzQwODYxIEMgMjA3Ljk1MDI4LDEwOS45NTcyOCAxNjAuMjUyOTIsODYuMDE2OTA5IDEwNy4zOTE4NCw2OC4wNTU1ODMgeiIgc3R5bGU9ImZpbGw6Izc1YTkyOCIgLz4KIDxwYXRoIGQ9Ik0gNDY3LjkyNDg3LDY4LjA1NTU4MyBDIDM5OS45NzcyLDEwMy4wODY5NCAzNjAuNDc3OTgsMTMxLjQyNDU1IDMzOC44Mzc3LDE1NS41NjAwNSBjIDExLjA4MjM1LDQ0LjQxNzU5IDY4Ljg5NjM4LDQ2LjQ0NDY0IDkwLjAzNTU5LDQ1LjE5ODU4IC00LjMyODQyLC0yLjAxNDc0IC03LjkzOTg4LC00LjQyNzc4IC05LjIyMDUxLC04LjEzNTc0IDUuMzA0NDksLTMuNzY5ODEgMjQuMTEyODksLTAuMzk3MTkgMzcuMjQzNjMsLTcuNzc0MTYgLTUuMDQ0MDcsLTEuMDQ0OTkgLTcuNDAzNDgsLTIuMDYzMDIgLTkuNzYyODksLTUuNzg1NDIgMTIuNDA1NzEsLTMuOTU2NyAyNS43Njg2MiwtNy4zNjY0MiAzMy42Mjc3NSwtMTMuOTIxMTYgLTQuMjQxMjYsMC4wNTI0IC04LjIwMTE2LDAuOTQ4OCAtMTMuNzQwMzcsLTIuODkyNzEgMTEuMTExNjksLTUuOTg4MTkgMjIuOTY5MTEsLTEwLjczMzUxIDMyLjE4MTM5LC0xOS44ODczOCAtNS43NDUyMSwtMC4xNDA2MyAtMTEuOTM5NDUsLTAuMDU2OCAtMTMuNzQwMzcsLTIuMTY5NTMgMTAuMTcwNDQsLTYuMzAwNjggMTguNzUxMjQsLTEzLjMwNzg3IDI1Ljg1MzU5LC0yMC45NzIxNSAtOC4wMzk5OCwwLjk3MDUyIC0xMS40MzUyOCwwLjEzNDc4IC0xMy4zNzg3OCwtMS4yNjU1NiA3LjY4Nzc5LC03Ljg3NDE5IDE3LjQxNzU2LC0xNC41MjMxOSAyMi4wNTY5MSwtMjQuMjI2NDQgLTUuOTY5NjEsMi4wNTc0ODQgLTExLjQzMTI1LDIuODQ1MDYgLTE1LjM2NzUyLC0wLjE4MDc5NSAyLjYxMjM3LC01Ljg5MzQ1MyAxMy44MDU0MSwtOS4zNjk2MTggMjAuMjQ4OTcsLTIzLjE0MTY3NiAtNi4yODQzNiwwLjYwOTM3NyAtMTIuOTQ5NjEsMS4zNzExMDggLTE0LjI4Mjc2LDAgMi45MjIzMSwtMTEuODg4NTYzIDcuOTI3NDYsLTE4LjU3MDAyNCAxMi44MzY0LC0yNS40OTIwMDMgLTEzLjQ1MDA0LC0wLjE5OTcyOSAtMzMuODI3NzUsMC4wNTIzNSAtMzIuOTA0NTcsLTEuMDg0NzY2IGwgOC4zMTY1NCwtOC40OTczMzUgYyAtMTMuMTM3NjIsLTMuNTM3MjQxIC0yNi41ODA2NSwwLjU2ODE2NCAtMzYuMzM5NjYsMy42MTU4ODcgLTQuMzgxODYsLTMuNDU3NjgxIDAuMDc3NiwtNy44Mjk5OCA1LjQyMzgzLC0xMi4yOTQwMTUgLTExLjE2NDk2LDEuNDkwNjQ2IC0yMS4yNTM4Miw0LjA1NzM4OSAtMzAuMzczNDUsNy41OTMzNjIgLTQuODcyMzgsLTQuMzk5MzI5IDMuMTYzODksLTguNzk4NjU4IDcuMDUwOTgsLTEzLjE5Nzk4NyAtMTcuMjQ5MzYsMy4yNzI1NjggLTI0LjU1NzE2LDcuODcwNjggLTMxLjgxOTgxLDEyLjQ3NDgxIC01LjI2OTM1LC01LjA1MDc5OSAtMC4zMDE2NiwtOS4zNDMyOTkgMy4yNTQzLC0xMy43NDAzNzEgLTEzLjAwNTY2LDQuODE3MDQ4IC0xOS43MDQ3OCwxMS4wMzU1NTEgLTI2Ljc1NzU2LDE3LjE3NTQ2MyAtMi4zOTExOSwtMy4yMjcwNTMgLTYuMDc0OTQsLTUuNTkyNDA4IC0xLjYyNzE1LC0xMy4zNzg3ODEgLTkuMjM0MTYsNS4zMjI3MjUgLTE2LjE4OTI2LDExLjU5NTA2IC0yMS4zMzM3NCwxOC42MjE4MTcgLTUuNzEzMzYsLTMuNjM3OTQxIC0zLjQwMzg3LC04LjYxMzAyMyAtMy40MzUwOSwtMTMuMTk3OTg3IC05LjU5NjY1LDcuODA2NTE2IC0xNS42ODY4NywxNi4xMTM5NSAtMjMuMTQxNjgsMjQuMjI2NDQzIC0xLjUwMTY5LC0xLjA5MzQzNyAtMi44MTY2MSwtNC44MDE3MSAtMy45Nzc0NywtMTAuNjY2ODY3IC0yMi44OTUzOSwyMi4yMTE4MTUgLTU1LjI0NTkxLDc4LjE1ODI0MSAtOC4zMTY1NCwxMDAuMzQwODYxIDM5LjkxODc3LC0zMi45NDcxNiA4Ny42MTYxMywtNTYuODg3NTMxIDE0MC40NzcyMSwtNzQuODQ4ODU3IHoiIHN0eWxlPSJmaWxsOiM3NWE5MjgiIC8+CiA8cGF0aCBkPSJtIDM2NS4yMDQ2LDUyMS44NDkzNyBhIDcxLjk1NjE1NCw2Ni41MzIzMTggMCAxIDEgLTE0My45MTIzMSwwIDcxLjk1NjE1NCw2Ni41MzIzMTggMCAxIDEgMTQzLjkxMjMxLDAgeiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4xMzExMDcsMCwwLDEuMTI4MDQ5NywtNDMuMTM5MTM1LC02OC4zMTA5ODMpIiBzdHlsZT0iZmlsbDojYmMxMTQyIiAvPgogPHBhdGggZD0ibSAyNjIuODQwOTEsMjc2LjY0Nzc0IGEgNjEuODc1LDI4LjEyNSAwIDEgMSAtMTIzLjc1LDAgNjEuODc1LDI4LjEyNSAwIDEgMSAxMjMuNzUsMCB6IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjc2NzQxNjg0LC0xLjE2MTMxMTIsMi4xNzExMTUsMS40MjI0MzY4LC01NjAuODg4NTgsMjE3LjY4ODU5KSIgc3R5bGU9ImZpbGw6I2JjMTE0MiIgLz4KIDxwYXRoIGQ9Im0gMjYyLjg0MDkxLDI3Ni42NDc3NCBhIDYxLjg3NSwyOC4xMjUgMCAxIDEgLTEyMy43NSwwIDYxLjg3NSwyOC4xMjUgMCAxIDEgMTIzLjc1LDAgeiIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNzY3NDE2ODQsLTEuMTYxMzExMiwtMi4xNzExMTUsMS40MjI0MzY4LDExMzQuODI4OCwyMTMuNjg4NTkpIiBzdHlsZT0iZmlsbDojYmMxMTQyIiAvPgogPHBhdGggZD0iTSA3Mi45MTAyNTMsMzQyLjA4NzggQyAxMDkuMzI0NDcsMzMyLjMzMDg4IDg1LjIwMTg0NSw0OTIuNzI0MzEgNTUuNTc2ODcxLDQ3OS41NjM1NyAyMi45OTAxMDMsNDUzLjM1MDg5IDEyLjQ5MzgwMSwzNzYuNTg4MTQgNzIuOTEwMjUzLDM0Mi4wODc4IHoiIHN0eWxlPSJmaWxsOiNiYzExNDIiIC8+CiA8cGF0aCBkPSJtIDQ5My42NzgyOCwzNDAuMDg3OCBjIC0zNi40MTQyMiwtOS43NTY5MiAtMTIuMjkxNiwxNTAuNjM2NTEgMTcuMzMzMzgsMTM3LjQ3NTc3IDMyLjU4Njc3LC0yNi4yMTI2OCA0My4wODMwNywtMTAyLjk3NTQzIC0xNy4zMzMzOCwtMTM3LjQ3NTc3IHoiIHN0eWxlPSJmaWxsOiNiYzExNDIiIC8+CiA8cGF0aCBkPSJtIDM2OS45NzE1OCwyMjAuNjUzNCBjIDYyLjgzNDg2LC0xMC42MTAxMyAxMTUuMTE1OTQsMjYuNzIyMjkgMTEzLjAxMTM4LDk0Ljg1Nzk2IC0yLjA2NjkzLDI2LjEyMTEyIC0xMzYuMTU4NzIsLTkwLjk2OTA3IC0xMTMuMDExMzgsLTk0Ljg1Nzk2IHoiIHN0eWxlPSJmaWxsOiNiYzExNDIiIC8+CiA8cGF0aCBkPSJNIDE5Ni4zNTk3NSwyMTguNjUzNCBDIDEzMy41MjQ4OSwyMDguMDQzMjcgODEuMjQzODEsMjQ1LjM3NTY5IDgzLjM0ODM3LDMxMy41MTEzNiA4NS40MTUzLDMzOS42MzI0OCAyMTkuNTA3MDksMjIyLjU0MjI5IDE5Ni4zNTk3NSwyMTguNjUzNCB6IiBzdHlsZT0iZmlsbDojYmMxMTQyIiAvPgogPHBhdGggZD0ibSAyODYuNjE5MzIsMjAyLjc1NTY4IGMgLTM3LjUwMjU5LC0wLjk3NTQ4IC03My40OTU0OCwyNy44MzQxOCAtNzMuNTgxNTgsNDQuNTQ0NDMgLTAuMTA0NjIsMjAuMzA0MjYgMjkuNjUxMiw0MS4wOTI2NiA3My44MzcyNiw0MS42MjAzNSA0NS4xMjMwNSwwLjMyMzIxIDczLjkxNTYxLC0xNi42NDA0OSA3NC4wNjExLC0zNy41OTQwOSAwLjE2NDg0LC0yMy43Mzk5NiAtNDEuMDM4NzksLTQ4LjkzNzQ0IC03NC4zMTY3OCwtNDguNTcwNjkgeiIgc3R5bGU9ImZpbGw6I2JjMTE0MiIgLz4KIDxwYXRoIGQ9Im0gMjg4LjkwOTM3LDYxOS4xMTY3NSBjIDMyLjY5NzQ0LC0xLjQyNzExIDc2LjU3MDgzLDEwLjUzMTk2IDc2LjY1NjgsMjYuMzk1OTggMC41NDI3LDE1LjQwNTIgLTM5Ljc4OTY5LDUwLjIxMDU1IC03OC44MjYzNCw0OS41Mzc2NSAtNDAuNDI3MjksMS43NDM5MSAtODAuMDY5MDgsLTMzLjExNTU5IC03OS41NDk1MSwtNDUuMTk4NTkgLTAuNjA1MDYsLTE3LjcxNTkzIDQ5LjIyNiwtMzEuNTQ3OTYgODEuNzE5MDUsLTMwLjczNTA0IHoiIHN0eWxlPSJmaWxsOiNiYzExNDIiIC8+CiA8cGF0aCBkPSJtIDE2OC4xMzg3NCw1MjUuMTAzNjkgYyAyMy4yNzkxLDI4LjA0NTczIDMzLjg5MDY2LDc3LjMxODk5IDE0LjQ2MzU1LDkxLjg0MzUzIC0xOC4zNzkxNywxMS4wODc4NCAtNjMuMDEyMjgsNi41MjE2MiAtOTQuNzM2MjM3LC0zOS4wNTE1NyAtMjEuMzk1MDUyLC0zOC4yNDE2OCAtMTguNjM3NTg0LC03Ny4xNTY2MyAtMy42MTU4ODcsLTg4LjU4OTI0IDIyLjQ2NDQyNCwtMTMuNjg0MjkgNTcuMTczNDI0LDQuNzk5MDIgODMuODg4NTc0LDM1Ljc5NzI4IHoiIHN0eWxlPSJmaWxsOiNiYzExNDIiIC8+CiA8cGF0aCBkPSJtIDQwNS4wMjA5LDUxNi4yMTE3NyBjIC0yNS4xODY4MiwyOS41MDE2NSAtMzkuMjEyMjcsODMuMzA5NTEgLTIwLjgzNzg1LDEwMC42NDI4IDE3LjU2ODI4LDEzLjQ2MzYxIDY0LjcyOTIsMTEuNTgxNjIgOTkuNTY1NjYsLTM2Ljc1NTc0IDI1LjI5NTk5LC0zMi40NjQ3MSAxNi44MjAxMywtODYuNjgyMjUgMi4zNzA3NywtMTAxLjA3NTExIC0yMS40NjQwOCwtMTYuNjAyMTMgLTUyLjI3NjkxLDQuNjQ0ODkgLTgxLjA5ODU4LDM3LjE4ODA1IHoiIHN0eWxlPSJmaWxsOiNiYzExNDIiIC8+Cjwvc3ZnPgo='

/**
 * Class for the makey makey blocks in Scratch 3.0
 * @constructor
 */
class Scratch3PiGPIOBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Raspberry Pi GPIO';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'pigpio';
    }
    
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3PiGPIOBlocks.EXTENSION_ID,
            name: Scratch3PiGPIOBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'set_gpio',
                    text: formatMessage({
                        id: 'pigpio.set_gpio',
                        default: 'set gpio [GPIO] to [OUTPUT]',
                        description: 'set gpio to value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            menu: 'outputs',
                            defaultValue: 'input'
                        }
                    }
                },
                {
                    opcode: 'get_gpio',
                    text: formatMessage({
                        id: 'pigpio.get_gpio',
                        default: 'gpio [GPIO] is high?',
                        description: 'is the selected gpio high?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        GPIO: {
                            type: ArgumentType.STRING,
                            menu: 'gpios',
                            defaultValue: '0'
                        },
                    }
                },
            ],
            menus: {
                outputs: ['output high', 'output low', 'input'],
                gpios: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27'],
            }
        };
    }

    set_gpio (args) 
    {
        const pin = Cast.toNumber(args.GPIO);
        const val = Cast.toString(args.OUTPUT);

        if (pin === '' || pin < 0 || pin > 27) return;
        var dir = 0, lev;
        if (val == 'output high') lev = 1;
        else if (val == 'output low') lev = 0;
        else dir = 1;

	// check the pin is exported
	if (!fs.existsSync("/sys/class/gpio/gpio" + pin)) 
		fs.writeFileSync("/sys/class/gpio/export", pin, "utf8");

	// the ownership of direction takes time to establish, so try this until it succeeds
	while (true)
	{
		try {
			fs.writeFileSync("/sys/class/gpio/gpio" + pin + "/direction", dir == 0 ? "out" : "in", "utf8");
			break;
		}
		catch (error) {
			continue;
		}
	}

	// set the output value
        if (dir == 0)
            fs.writeFileSync("/sys/class/gpio/gpio" + pin + "/value", lev == 1 ? "1" : "0", "utf8");
    }

    get_gpio (args) 
    {
        const pin = Cast.toNumber(args.GPIO);

        if (pin === '' || pin < 0 || pin > 27) return;

	// check the pin is exported
	if (!fs.existsSync("/sys/class/gpio/gpio" + pin)) 
		fs.writeFileSync("/sys/class/gpio/export", pin);

	// read the pin value
	var data = fs.readFileSync ("/sys/class/gpio/gpio" + pin + "/value", 'utf8');
	console.log (data)
	if (data.slice(0,1) == "1") return true;
	else return false;
    }

}

module.exports = Scratch3PiGPIOBlocks;
