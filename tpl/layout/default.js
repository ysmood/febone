export default ({ vendor, page }) =>

`<!DOCTYPE html>
<html>
<meta http-equiv=Content-Type content="text/html;charset=utf-8">
<head>
    <title>DEV</title>
</head>
<body>
    <script type="text/javascript" src="${vendor}"></script>
    <script type="text/javascript" src="${page}"></script>
</body>
</html>`;
