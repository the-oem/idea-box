'use strict';

var $body = $('body');
var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $submitBtn = $('.submit-btn');
var $searchInput = $('.search-input');
var ideaArray = [];

// Constructors

function Idea(title, body, id) {
	this.title = title;
	this.body = body;
	this.id = id;
	this.quality = "swill";
	console.log(this);
}

$(document).ready(function () {
	loadIdeas();
});

function loadIdeas() {
	ideaArray = JSON.parse(localStorage.getItem('ideaBoxArray')) || [];
	for (var i = 0; i < ideaArray.length; i++) {
		prependIdea(ideaArray[i]);
	}
}

// Function to check that the input fields all have data before enabling the Add to Album button.
function readyToSubmit() {
	if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
		toggleDisabled(false);
	} else {
		toggleDisabled(true);
	}
}

// Function to toggle the disabled flag on the Add to Album button. jQuery, you really should make this easier...le sigh.
function toggleDisabled(value) {
	$submitBtn.prop('disabled', value);
}

// Event listeners on the input container that allow for checking of valid inputs before enabling the Add to Album button.
$body
	.on('input', '.title-input', readyToSubmit)
	.on('input', '.body-input', readyToSubmit)
	.on('click', '.submit-btn', function () {
		event.preventDefault();
		var idea = new Idea($titleInput.val(), $bodyInput.val(), newGuid());
		storeIdea(idea);
		prependIdea(idea);
	});

function newGuid() {
	return Math.round(Math.random() * Date.now());
}

function storeIdea(idea) {
	ideaArray.push(idea);
	localStorage.setItem('ideaBoxArray', JSON.stringify(ideaArray));
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
				<span class="quality-label">quality: <span class="idea-quality">${$quality}</span></span>
	    </div>
	    <hr class="divider">
	  </div>`);
	resetForm();
}

function resetForm() {
	$titleInput.val('');
	$bodyInput.val('');
	toggleDisabled(true);
	$titleInput.focus();
}
