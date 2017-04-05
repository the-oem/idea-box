// 'use strict';

//debugger;

var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $submitBtn = $('.submit-btn');
var $searchInput = $('.search-input');

// Constructors

function Idea(title, body, id) {
	this.title = title;
	this.body = body;
	this.id = id;
	this.quality = "swill";
	console.log(this);
}


$('.submit-btn').on("click", function () {
	//debugger;
	event.preventDefault();
	var $title = $titleInput.val();
	var $body = $bodyInput.val();
	var $id = Math.round(Math.random() * Date.now());
	var idea = new Idea($title, $body, $id);
	// console.log(idea);
	//storeIdea(idea);
	prependIdea(idea);
})

function storeIdea(idea) {
	localStorage.setItem(idea.id, idea);
}

function prependIdea(idea) {
	// debugger;
	var $title = idea.title;
	var $body = idea.body;
	var $quality = idea.quality;
	var $id = idea.id;
	$(".card-listing").prepend(`
	  <div class="card" id="${$id}">
	    <div class="card-header">
	      <h3 class="idea-title">${$title}</h3>
	      <button type="button" name="button" class="delete-btn" />
	    </div>
	    <p class="idea-body">${$body}</p>
	    <div class="card-footer">
	      <button type="button" name="button" class="upvote-btn" />
	      <button type="button" name="button" class="downvote-btn" />
				<span class="idea-quality">quality: ${$quality}</span>
	    </div>
	    <hr class="divider">
	  </div>`);
	resetForm();
}

function resetForm() {
	$titleInput.val('');
	$bodyInput.val('');
}
