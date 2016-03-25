module.exports = (data) =>

`<!DOCTYPE html>
<html>
<meta http-equiv=Content-Type content="text/html;charset=utf-8">
<head>
    <title>DEV</title>
    <link rel="shortcut icon" type="image/png" href="/img/favicon.ico?__CDN__"/>
</head>
<body>
    <script type="text/javascript" src="${data.vendor}"></script>
    <script type="text/javascript" src="${data.page}"></script>
</body>
</html>`;
