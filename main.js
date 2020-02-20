window.addEventListener("load", main);

async function main(){
	const store = {};

	store.responsesList = await getResponsesList();
	store.responsesNodeList = getResponsesNodeList(store);
	store.controls = initSliderControls();

	appendResponses(store);
	addControlsEventListeners(store);
}
async function getResponsesList(){
	return [
		{
			"author": "Алексей Ичко",
			"paragraphs": [
				"Практикум полностью оправдал ожидания, помог в голове отдельные знания собрать в структуру, в план действий.",
				"Так же большой плюс – это Ваш собственный пример, пример того, что Вы не только на обучении рассказываете о систематизации бизнеса, но и сами успешно внедряете технологии в свою компанию."
			]
		},
		{
			"author": "Лариса Банах",
			"paragraphs": [
				"Практикум полностью оправдал ожидания, помог в голове отдельные знания собрать в структуру, в план действий.",
				"Так же большой плюс – это Ваш собственный пример, пример того, что Вы не только на обучении рассказываете о систематизации бизнеса, но и сами успешно внедряете технологии в свою компанию."
			]
		},
		{
			"author": "Джон До",
			"paragraphs": [
				"Практикум полностью оправдал ожидания, помог в голове отдельные знания собрать в структуру, в план действий.",
				"Так же большой плюс – это Ваш собственный пример, пример того, что Вы не только на обучении рассказываете о систематизации бизнеса, но и сами успешно внедряете технологии в свою компанию."
			]
		}
	];
}
function getResponsesNodeList({responsesList}){
	const responseTemplate = getResponseTemplate();

	return responsesList.map(response => getResponse(responseTemplate, response));
}
function appendResponses({responsesNodeList}){
	const responsesContainer = document.createElement("ul");

	responsesContainer.classList.add("responses-container");
	responsesNodeList.forEach(responseNode => {
		responsesContainer.appendChild(responseNode);
	});

	document.querySelector(".responses-container-wrapper").appendChild(responsesContainer);
}
function getResponse(template, responseObj){
	const responseBody = template.cloneNode(true);
	const authorName = responseBody.querySelector(".response-author-name");
	const textContainer = responseBody.querySelector(".response-text-wrapper");

	authorName.innerHTML = responseObj.author;	
	responseObj.paragraphs.forEach(paragraph => {
		const paragraphNode = document.createElement("p");

		paragraphNode.classList.add("response-text");
		paragraphNode.innerHTML = paragraph;
		textContainer.appendChild(paragraphNode);
	});

	return responseBody;
}
function getResponseTemplate(){
	const template = document.getElementById("response-template");
	const templateDuplicate = template.cloneNode(true);

	templateDuplicate.removeAttribute("id");
	templateDuplicate.classList.remove("template");
	return templateDuplicate;
}
function initSliderControls(){
	const controls = {
		nextButton: document.querySelector(".response-button-next"),
		prevButton: document.querySelector(".response-button-prev")
	};
	return controls;
}
function addControlsEventListeners({controls, responsesNodeList}){
	controls.currentResponseIndex = 0;
	controls.touchStart = 0;

	const container = document.querySelector(".responses-container");
	const updateButtonIcons = () => {
		const hasNextResponse = controls.currentResponseIndex + 1 < responsesNodeList.length && responsesNodeList.length > 0;
		const hasPrevResponse = controls.currentResponseIndex > 0 && responsesNodeList.length > 0;

		controls.nextButton.classList.remove("response-button-active");
		controls.prevButton.classList.remove("response-button-active");

		if(hasNextResponse){
			controls.nextButton.classList.add("response-button-active");
		}
		if(hasPrevResponse){
			controls.prevButton.classList.add("response-button-active");
		}
	};
	const slideForwards = () => {
		const nextResponseNode = responsesNodeList[controls.currentResponseIndex + 1];

		if(!nextResponseNode) return;
		const responseRect = nextResponseNode.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const shift = containerRect.left - responseRect.left;

		container.style.setProperty("--translateX", `${shift}px`);
		controls.currentResponseIndex++;
		updateButtonIcons();
	};
	const slideBackwards = () => {
		const nextResponseNode = responsesNodeList[controls.currentResponseIndex - 1];

		if(!nextResponseNode) return;

		const responseRect = nextResponseNode.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const shift = containerRect.left - responseRect.left;

		container.style.setProperty("--translateX", `${shift}px`);
		controls.currentResponseIndex--;
		controls.shift = shift;
		updateButtonIcons();
	};

	controls.nextButton.addEventListener("click", slideForwards);
	controls.prevButton.addEventListener("click", slideBackwards);
	document.addEventListener("keyup", e => {
		if(e.code === "ArrowRight"){
			slideForwards();
		}
		else if(e.code === "ArrowLeft"){
			slideBackwards();
		}
	});
	container.addEventListener("wheel", e => {
		if(e.deltaY > 0){
			slideForwards();
		}
		else{
			slideBackwards();
		}
	});
	container.addEventListener("touchstart", e => controls.touchStart = e.touches[0].clientX);
	container.addEventListener("touchend", e => {
		const touchEnd = e.changedTouches[0].clientX;
		const minRequiredMovement = 10;
		if(Math.abs(touchEnd - controls.touchStart) > minRequiredMovement){
			if(touchEnd - controls.touchStart < 0){
				slideForwards();
			} 
			else{
				slideBackwards();
			}
		}
	});
	responsesNodeList.forEach(response => {
		response.querySelector(".response-expand-button").addEventListener("click", e => {
			const textWrapper = e.currentTarget.closest(".response-body").querySelector(".response-text-wrapper");
			textWrapper.classList.toggle("expanded");
		});
	});
}