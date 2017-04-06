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

// Document ready state

$(document).ready(function () {
	loadIdeas();
});

function loadIdeas() {
	ideaArray = JSON.parse(localStorage.getItem('ideaBoxArray')) || [];
	for (var i = 0; i < ideaArray.length; i++) {
		prependIdea(ideaArray[i]);
	}
}

// Set up of Event listeners, all attached to the body of the document.
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



function showSearchResults() {
	var $searchTerm = $(this).val().toUpperCase();
	if ($searchTerm !== '') {
		var results = ideaArray.filter(function (idea) {
			return idea.title.toUpperCase().indexOf($searchTerm) > -1 || idea.body.toUpperCase().indexOf($searchTerm) > -1 || idea.quality.toUpperCase().indexOf($searchTerm) > -1;
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

function populateTestData() {
	var testData = `[{"title":"Let's make money!","body":"I like making money. My idea is to use the internet to target businesses for freelance work. We can use VentureBeat to get the data!","id":108490178362,"quality":"swill"},{"title":"Pull up bar in the Vault","body":"I think we all should exercise more. It would be great if we could put a pull up bar in the vault for people to use when they want 5 minutes of good exercise.","id":1338002234262,"quality":"swill"},{"title":"Add search highlighting to this app.","body":"It would be really cool if the search text were either highlighted or bolded in the idea card as users typed in their search criteria.","id":253777415728,"quality":"swill"},{"title":"Flying cars.","body":"It seems like flying cars is a great idea. Then we could get rid of traffic and all this other bullshit. They can do it in movies, so we should really just focus on making it a reality. Amiright?","id":118873475212,"quality":"swill"},{"title":"Samuel L Ipsum. K?","body":"You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.My money's in that office, right? If she start giving me some bullshit about it ain't there, and we got to go someplace else and get it, I'm gonna shoot you in the head then and there. Then I'm gonna shoot that bitch in the kneecaps, find out where my goddamn money is. She gonna tell me too. Hey, look at me when I'm talking to you, motherfucker. You listen: we go in there, and that dude Winston or anybody else is in there, you the first motherfucker to get shot. You understand?","id":581251272271,"quality":"swill"}]`;
	localStorage.setItem('ideaBoxArray', testData);
}
