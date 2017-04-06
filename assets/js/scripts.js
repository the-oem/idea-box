'use strict';

var $body = $('body');
var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $submitBtn = $('.submit-btn');
var $searchInput = $('.search-input');
var ideaArray = [];
var qualityArray = ['swill', 'plausible', 'genius']

// Constructors

function Idea(title, body) {
	this.title = title;
	this.body = body;
	this.id = Math.round(Math.random() * Date.now());
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
		var idea = new Idea($titleInput.val(), $bodyInput.val());
		storeIdea(idea);
		prependIdea(idea);
		resetForm();
	})
	.on('click', '.delete-btn', deleteIdea)
	.on('click', '.upvote-btn', adjustQuality)
	.on('click', '.downvote-btn', adjustQuality)
	.on('input keydown', '.idea-title', updateInline)
	.on('input keydown', '.idea-body', updateInline)
	.on('input', '.search-input', showSearchResults);

function showSearchResults() {
	var $searchTerm = $(this).val();
	if ($searchTerm !== '') {
		var results = ideaArray.filter(function (idea) {
			return idea.title.indexOf($searchTerm) > -1 || idea.body.indexOf($searchTerm) > -1 || idea.quality.indexOf($searchTerm) > -1;
		});
	} else {
		var results = ideaArray;
	}
	$('.card-listing').children().remove();
	prependSearchResults(results);
}

function updateInline() {
	if (event.keyCode === 13) {
		event.preventDefault();
		this.blur();
	}
	var $updateElement = $(this).prop('class');
	var $updateValue = $(this).text();
	switch ($updateElement) {
		case 'idea-title':
			var $ideaId = $(this).parent().parent().prop('id');
			updateIdea($ideaId, 'title', $updateValue);
			break;
		case 'idea-body':
			var $ideaId = $(this).parent().prop('id');
			updateIdea($ideaId, 'body', $updateValue);
			break;
		default:
			console.log('Houston, we have a problem while updating title or body.');
	}
	storeIdeas();
}

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
			console.log('Houston, we have a problem while updating quality.');
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

function storeIdea(idea) {
	ideaArray.push(idea);
	storeIdeas();
}

function storeIdeas() {
	localStorage.setItem('ideaBoxArray', JSON.stringify(ideaArray));
}

function prependSearchResults(searchResults) {
	searchResults.forEach(function (idea) {
		prependIdea(idea);
	});
}

function prependIdea(idea) {
	$(".card-listing").prepend(`
	  <div class="card" id="${idea.id}">
	    <div class="card-header">
	      <h3 class="idea-title" contenteditable="true">${idea.title}</h3>
	      <button type="button" name="button" class="delete-btn" />
	    </div>
	    <p class="idea-body" contenteditable="true">${idea.body}</p>
	    <div class="card-footer">
	      <button type="button" name="button" class="upvote-btn" />
	      <button type="button" name="button" class="downvote-btn" />
				<span class="quality-label">quality: <span class="idea-quality">${idea.quality}</span></span>
	    </div>
	    <hr class="divider">
	  </div>`);
}

function resetForm() {
	$titleInput.val('');
	$bodyInput.val('');
	toggleDisabled($submitBtn, true);
	$titleInput.focus();
}
