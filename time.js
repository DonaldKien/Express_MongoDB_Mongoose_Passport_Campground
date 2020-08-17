

function currentTime(date) {
	var currentDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
	var hours = date.getHours() + 10;
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = currentDate + ' ' + hours + ':' + minutes + ' ' + ampm ;
	return strTime;
}

module.exports = currentTime(new Date);