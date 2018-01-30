$(function(){
	var contactsList = [];

	var $formInputs = $('.form-input');
	var $name = $('#name');
	var $surname = $('#surname');
	var $submitBtn = $('#submit');
	var $form = $('form');
	var $contactsTable = $('table');

	var contactTemplate = $('#contactTemplate').html();

	$form
		.change(onFormChange)
		.submit(onFormSubmit)

	$contactsTable.on('click', '.delete-btn', onDeleteBtnClick)

	init();

	// Callbacks
	function onDeleteBtnClick(){
		var id = $(this).closest('tr').data('id');

		deleteContact(id);
	}

	function onFormChange(){
		checkFormValid();
	}

	function onFormSubmit(event){
		event.preventDefault();

		var contact = {
			name: $name.val(),
			surname: $surname.val()
		}

		addContact(contact);
	}

	// DOM Manipulations
	function renderNewContact(contact){
		var row = contactTemplate
				.replace('{{id}}', contact.id)
				.replace('{{name}}', contact.name)
				.replace('{{surname}}', contact.surname);

		$contactsTable.append(row);
	}

	function removeContactFromTable(id){
		$('[data-id="' + id + '"]').remove();
	}

	function enableButton(){
		$submitBtn.removeAttr('disabled')
	}

	function disableButton(){
		$submitBtn.attr('disabled', 'disabled')
	}

	// Bussiness Logic
	function init(){
		var item = localStorage.getItem('list');

		if (item){
			contactsList = JSON.parse(item);
		}

		$.each(contactsList, function(i, contact) {
			renderNewContact(contact)
		});
	}

	function addContact(contact){
		contact.id = Date.now();

		contactsList.push(contact);

		renderNewContact(contact);
		saveContacts();
	}


	function deleteContact(id){
		contactsList = contactsList.filter(function(contact){
			return contact.id != id;
		});

		saveContacts();

		removeContactFromTable(id)
	}

	function saveContacts(){
		localStorage.setItem('list', JSON.stringify(contactsList));
	}


	function checkFormValid(){
		if(isFormValid()){
			enableButton()
		} else {
			disableButton()
		}
	}

	function isFormValid(){
		var result = true;

		$formInputs.each(function(){
			var $input = $(this);

			result = !!$input.val();

			return result;
		});

		return result;
	}
})