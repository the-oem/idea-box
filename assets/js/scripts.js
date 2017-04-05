'use strict';

var $body = $('body');
var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $submitBtn = $('.submit-btn');
var $searchInput = $('.search-input');
var ideaArray = [];
var qualityArray = ['swill', 'plausible', 'genius']

// Constructors

function Idea(title, body, id) {
	this.title = title;
	this.body = body;
	this.id = id;
	this.quality = "swill";
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

function readyToSubmit() {
	if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
		toggleDisabled($submitBtn, false);
	} else {
		toggleDisabled($submitBtn, true);
	}
}

function toggleDisabled(buttonReference, value) {
	buttonReference.prop('disabled', value);
}

$body
	.on('input', '.title-input', readyToSubmit)
	.on('input', '.body-input', readyToSubmit)
	.on('click', '.submit-btn', function () {
		event.preventDefault();
		var idea = new Idea($titleInput.val(), $bodyInput.val(), newGuid());
		storeIdea(idea);
		prependIdea(idea);
	})
	.on('click', '.delete-btn', deleteIdea)
	.on('click', '.upvote-btn', adjustQuality)
	.on('click', '.downvote-btn', adjustQuality);

function deleteIdea() {
	var $id = $(this).parent().parent().prop('id');
	$(this).parent().parent().remove();
	removeFromStorage($id);
}

function adjustQuality() {
	var $buttonClicked = $(this).prop('class');
	var $ideaId = $(this).parent().parent().prop('id');
	var $qualityElement = $(this).parent().find('.idea-quality');
	var $currentQuality = $qualityElement.text();
	switch ($buttonClicked) {
		case 'upvote-btn':
			var newQuality = qualityArray[qualityArray.indexOf($currentQuality) + 1] || $currentQuality;
			break;
		case 'downvote-btn':
			var newQuality = qualityArray[qualityArray.indexOf($currentQuality) - 1] || $currentQuality;
			break;
		default:
			console.log('Houston, we have a fucking problem.');
			break;
	}
	updatePageText($qualityElement, newQuality);
	updateIdea($ideaId, 'quality', newQuality);
	storeIdeas();
}

function updatePageText(element, value) {
	element.text(value);
}

function updateIdea(id, property, value) {
	var updatedList = ideaArray.map(function (idea) {
		if (idea.id == id) {
			idea[property] = value;
		}
		return idea;
	})
}

function removeFromStorage(id) {
	var idToDelete = id;
	ideaArray.forEach(function (idea, index) {
		if (idea.id == id) {
			ideaArray.splice(index, 1);
		}
	})
	localStorage.setItem('ideaBoxArray', JSON.stringify(ideaArray));
}

function newGuid() {
	return Math.round(Math.random() * Date.now());
}

function storeIdea(idea) {
	ideaArray.push(idea);
	storeIdeas();
}

function storeIdeas() {
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
	toggleDisabled($submitBtn, true);
	$titleInput.focus();
}
