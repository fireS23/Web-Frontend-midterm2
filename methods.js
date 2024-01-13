// Cookie operations
function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
	const cookieName = `${name}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(";");

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i].trim();
		if (cookie.indexOf(cookieName) === 0) {
		return cookie.substring(cookieName.length, cookie.length);
		}
	}
	return null;
}

function deleteCookie(name) {
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Local Storage operations
function setLocalStorageItem(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
	const storedValue = localStorage.getItem(key);
	return storedValue ? JSON.parse(storedValue) : null;
}

function removeLocalStorageItem(key) {
	localStorage.removeItem(key);
}

// Save user input data
function handleSaveData() {
	const name = getValue("name");
	const male = getChecked("male");
	const female = getChecked("female");
	const genderValue = male ? 0 : (female ? 1 : null);

	if (genderValue !== null) {
		setLocalStorageItem(name, genderValue); // save in local storage
		console.log("Data saved");
	}
}

  // Set error label
function setErrorLabel(error) {
	document.getElementById('error_label').innerHTML = error;
}

  // Check gender from API
function handleSubmitData() {
	const name = getValue("name");

	fetch(`https://api.genderize.io/?name=${name}`)
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		const gender = data['gender'];
		document.getElementById('prediction_class_label').innerHTML = gender;
		document.getElementById('prediction_val_label').innerHTML = `${data['probability']}`;
		setValue("prediction", "fetched");

		if (gender === 'male') {
			setChecked('male', true);
		} 
		else if (gender === 'female') {
			setChecked('female', true);
		} else {
		document.getElementById('prediction_class_label').innerHTML = 'alien';
		setChecked('male', false);
		setChecked('female', false);
		}
		console.log('Data from API:', data);
	})
	.catch(error => {
		setErrorLabel(error.toString());
	})
	.finally(() => {
		setTimeout(() => {
		console.log('1-second timeout completed.');
		}, 1000);
	});
	console.log("Data submitted");
}  
// Clear results to initial state
function clearResults() {
	setValue("prediction", "not found");
	setValue("prediction_val_label", "");
	document.getElementById('prediction_class_label').innerHTML = "";
	document.getElementById('prediction_val_label').innerHTML = "";
	setChecked("female", false);
	setChecked("male", false);
	setErrorLabel("");
}

function handleClearPrediction() {
	const name = getValue("name");
	removeLocalStorageItem(name);
	clearResults();
}

// Input change event
function handleTextChange() {
	const name = getValue("name");
	const cookieValue = getCookie(name);
	const localStorageValue = getLocalStorageItem(name);

	if (cookieValue || localStorageValue) {
		clearResults();

	if (cookieValue === 0 || localStorageValue === 0) {
		setValue("prediction", "Saved Answer");
		setChecked("male", true);
		document.getElementById('prediction_class_label').innerHTML = "Male";
	}

	if (cookieValue === 1 || localStorageValue === 1) {
		setValue("prediction", "Saved Answer");
		setChecked("female", true);
		document.getElementById('prediction_class_label').innerHTML = "Female";
	}
	} else {
		clearResults();
	}
}

// Helper functions from original code
function setValue(name, value) {
	document.getElementById(name).value = value;
}

function setChecked(name, checked) {
	document.getElementById(name).checked = checked;
}

function getValue(name) {
	return document.getElementById(name).value;
}

function getChecked(name) {
	return document.getElementById(name).checked;
}