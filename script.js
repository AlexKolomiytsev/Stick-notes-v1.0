var myApp = {

	dragSrcEl: null,
	that: 0,

	addEvent: function(element, eventType, func, useCapture) {
		if(element.addEventListener) { 
			element.addEventListener(eventType, func, useCapture);
			return true;
		}
		else if (element.attachEvent) {
			var r = element.attachEvent('on'+eventType, func);
			return r;
		}
		else {
			element['on'+eventType] = func;
		}
	},
	addNote: function(event) {
		event.preventDefault();
		var numOfNotes = document.getElementsByClassName('notes');
		if (numOfNotes.length >= 1) { //если существует хотябы один стик, то скопировать его и вставить
			var newNote = stNotes.children[0].cloneNode(true);
			newNote.setAttribute('id', randomIntFromInterval(1,1000));
			stNotes.insertAdjacentElement("beforeEnd", newNote);
		}
		else { //если удалили все, а создавать новые стики не из чего
			stNotes.insertAdjacentHTML("beforeEnd", '<div class="col-lg-3 notes"  draggable="true">'+
				'<div class="del">'+
				'<i class="fa fa-minus"></i>'+
				'</div>'+
				'<textarea class="note" placeholder="Your note">'+
				'</textarea>'+
				'</div>');
		}

		var deleteNote = document.getElementsByClassName('fa-minus');

		var dndElements = document.getElementsByClassName('notes');

		for (var i = 0; i<dndElements.length; i++) {
			dndElements[i].addEventListener("dragstart", myApp.dragStartElement);
			dndElements[i].addEventListener("dragenter", myApp.dragEnter);
			dndElements[i].addEventListener("dragleave", myApp.dragLeave);
			dndElements[i].addEventListener("dragover", myApp.makeDroppable);
			dndElements[i].addEventListener("drop", myApp.dropElement);

		}

		for (var i = 0; i < deleteNote.length; i++){
			myApp.addEvent(deleteNote[i], "click", myApp.deleteNotes, false);	
		}

		var textareaElements = document.getElementsByClassName('note');
		for (var i = 0; i < textareaElements.length; i++) {
			textareaElements[i].addEventListener("change", myApp.writeCookie);
		}
	},
	writeCookie: function () {
		var now = new Date();
		now.setMonth( now.getMonth() + 1 );
		document.cookie = "note_" + this.id + "=" + this.value + ";" + "expires=" + now.toUTCString() + ";";
		console.log(document.cookie);
	},
	deleteNotes: function() {
		console.log("qqq");
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	},
	dragStartElement: function(e) {
		e.dataTransfer.setData("text/html", e.target.children[1].value); //сохранение данных перетаскиваемого обьекта в начале операции перетаскивания
		myApp.that = e.target;

	},
	dropElement: function(e) {
		var rdata = e.dataTransfer.getData("text/html");
		myApp.that.children[1].value = e.target.value;

		e.target.value = rdata;
		e.target.classList.remove('dragenterclass');

	},
	dragEnter: function(e) {
		e.target.classList.add('dragenterclass');
	},
	dragLeave: function(e) {
		e.target.classList.remove('dragenterclass');
	},
	makeDroppable: function(e) {
		e.preventDefault();
	},
	load: function() {
		var cookieArray = document.cookie.split(';');
		console.log(cookieArray);

		var addNewNote = document.getElementsByClassName('add')[0];
		myApp.addEvent(addNewNote,"click", myApp.addNote, false);

		var deleteNote = document.getElementsByClassName('fa-minus'); //если еще не нажимали кнопку добавить
		myApp.addEvent(deleteNote[0],"click", myApp.deleteNotes, false); //если еще не нажимали кнопку добавить

		var textareaElements = document.getElementsByClassName('note');
		for (var i = 0; i < textareaElements.length; i++) {
			textareaElements[i].addEventListener("change", myApp.writeCookie);
		}

		var textareaElements = document.getElementsByClassName('note');

		textareaElements[0].value = cookieArray[0].split('=')[1];


	}
};

myApp.addEvent(window, "load", myApp.load, false);

function randomIntFromInterval(min,max)
{
	return Math.floor(Math.random()*(max-min+1)+min);
}