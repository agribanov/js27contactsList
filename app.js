$(function(){
	var contactsList = {};

	var $formInputs = $('.form-input');
	var $id = $('#id');
	var $name = $('#name');
	var $surname = $('#surname');
	var $submitBtn = $('#submit');
	var $clearBtn = $('#clearFormBtn')
	var $form = $('form');
	var $showFormBtn = $('#showFormBtn');
	var $contactsTable = $('table');

	var contactTemplate = $('#contactTemplate').html();

	$form
		.change(onFormChange)
		.submit(onFormSubmit)

	$clearBtn.click(onClearBtnClick)

	$contactsTable
		.on('click', '.delete-btn', onDeleteBtnClick)
		.on('click', '.edit-btn', onEditBtnClick)

	$showFormBtn.click('click', onShowFormBtnClick)
	init();

	// Callbacks
	function onClearBtnClick(event){
		event.preventDefault();
		clearForm();
	}

	

	function onShowFormBtnClick(){
		$form.toggleClass('collapsed');
	}

	function onEditBtnClick(){
		var id = $(this).closest('tr').data('id');

		editContact(id)	
	}

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
			id: $id.val(),
			name: $name.val(),
			surname: $surname.val()
		}

		setContact(contact);
		clearForm();
	}

	// DOM Manipulations
	function getContactElemet(id){
		return $('[data-id="' + id + '"]');
	}

	function createContactElement(contact){
		var row = contactTemplate
			.replace('{{id}}', contact.id)
			.replace('{{name}}', contact.name)
			.replace('{{surname}}', contact.surname);

		return $(row);
	}

	function renderNewContact(contact){
		var $row = createContactElement(contact);

		$contactsTable.append($row);

		$row.fadeIn(300)
	}

	function removeContactFromTable(id){
		var $tr = getContactElemet(id);

		$tr.fadeOut('slow', function(){
			$tr.remove()
		});
	}

	function renderUpdatedContact(contact){
		var $tr = getContactElemet(contact.id);
		var $row = createContactElement(contact);
		console.log('rendering updated', $tr, $row)
		$tr.replaceWith($row);
	}

	function enableButton(){
		$submitBtn.removeAttr('disabled')
	}

	function disableButton(){
		$submitBtn.attr('disabled', 'disabled')
	}

	function clearForm(){
		$id.val('');
		$name.val('');
		$surname.val('');
	}

	function fillForm(contact){
		$id.val(contact.id);
		$name.val(contact.name);
		$surname.val(contact.surname);

		checkFormValid();
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


	function setContact(contact){
		contact.id ? updateContact(contact) : addContact(contact);
		saveContacts();
	}

	function addContact(contact){
		contact.id = Date.now();
		contactsList[contact.id] = contact; // {2 : {id: 2, name: 'John', surname: 'Doe'}}

		renderNewContact(contact);
	}

	function updateContact(contact){
		contactsList[contact.id] = contact; 

		renderUpdatedContact(contact);
	}

	function deleteContact(id){
		delete contactsList[id];

		saveContacts();

		removeContactFromTable(id)
	}

	function editContact(id){
		var contact = contactsList[id];

		fillForm(contact);
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