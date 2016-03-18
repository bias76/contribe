var selected_images = new Array();

function close_gallery() {
	document.getElementById("gallery_content").innerHTML = "";
	document.getElementById("disp_image").innerHTML = "";
	document.getElementById("overlay").style.display = 'none';		
}

function disp_image(id) {
	document.getElementById("disp_image").innerHTML = "<img class='disp shadow' style='padding:10px;border:1px solid #999;background-color:#fff;' src='"+document.getElementById(id).getAttribute("f_src")+"'>";
}

function toggle(id) {
	var sel = document.getElementById(id);
	if (sel.className.indexOf("selected") != -1) { 		
		sel.className = "images";
		selected_images.splice(selected_images.indexOf(id),1);
	}
	else {
		sel.className = "images selected";
		selected_images.push(id);
	}
}

document.getElementById("gallery").onclick = function() {
	if (selected_images.length != 0) { 
		document.getElementById("gallery_content").innerHTML = "";
		document.getElementById("overlay").style.display = 'block';
		for (var i = 0; i < selected_images.length; ++i) {
			f = document.getElementById(selected_images[i]).getAttribute("f_src");
			s = document.getElementById(selected_images[i]).src;
			document.getElementById("gallery_content").innerHTML = document.getElementById("gallery_content").innerHTML + "<img onclick='disp_image("+document.getElementById(selected_images[i]).id+");' class='g_images' f_src='"+f+"' src='"+s+"'>";
		}
	}
	else {
		alert("Inga bilder är valda");
	}
}

document.getElementById("search").onclick = function() {
	selected_images = [];
	document.getElementById("content").innerHTML = "";
	var req = new XMLHttpRequest();
	req.open('GET', 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=ea82bf1da5b0eb9184cd5a5e01176dfd&tags='+document.getElementById("string").value+'&per_page=50&page=1&format=json&nojsoncallback=1', true);
	req.send();
	req.onreadystatechange = function (aEvt) {
	    if(req.readyState == 4 && req.status == 200) {
			var data = JSON.parse(req.responseText);
			if (data.photos.photo.length == 0) {
				alert("Inga bilder hittades");
			}
			else {
				for (i = 0; i < data.photos.photo.length; i++) { 
					photo = data.photos.photo[i];
					t_url = "http://farm" + photo.farm + ".static.flickr.com/" +photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
					f_url = "http://farm" + photo.farm + ".static.flickr.com/" +photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
					document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "<img onclick='toggle("+photo.id+");' id='"+photo.id+"' class='images' src="+t_url+" f_src="+f_url+">";
				}
			}
		}
	}
}