<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script src="/socket.io/socket.io.js"></script>
	<script>
	  var socket = io.connect('http://localhost:3000');
	  socket.on('news', function (data) {
	    console.log(data);
	    socket.emit('my other event', { my: 'data' });
	  });
	</script>
</head>
<body>
<?php
	echo "hello";
	echo " buddy";
?>
</body>
</html>