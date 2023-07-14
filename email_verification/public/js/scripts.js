
$(document).ready(function(){
	var isRowEditing = false; // Variable to track if a row is being edited
	$.ajaxSetup({
		headers:
		{ 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
	});

	// Add row on add button click
	$(document).on("click", ".add", function(){
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			isRowEditing = false;
		}		
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '" >');
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
		isRowEditing = true;
    });
	// password
	$(document).on('click', '.newPassword', function () {
		var addNewPassword = $('.addNewPassword');
		
		// Check if the input fields are already appended
		if (addNewPassword.children('input').length === 0) {
			// Append the input fields
			addNewPassword.append('<input class="form-control mt-2" type="text" id="password" placeholder="New password" value=""/><input class="form-control mt-2" type="text" id="confirmPassword" placeholder="Confirm password" value=""/>');
		} else {
			// Remove the input fields
			addNewPassword.empty();
		}
		if (addNewPassword.children('input').length === 0) {
			// Reset error styling
			$('.error-message').remove();
		}
	});
	var first_name, last_name, email;
	$(document).on('click','#submit', function (e) {
		e.preventDefault();
		if (isRowEditing) {
			displayErrorMessage('Please click "Add" to finish editing the row.');
			return;
		}
		else{
			$('.error-message').remove();
		}
		$('tbody tr').each(function() {
			
			$(this).find('td:not(:last-child)').each(function(index) {
				var value = $(this).text();
				switch (index) {
					case 0:
						first_name = value;
						break;
					case 1:
						last_name = value;
						break;
					case 2:
						email = value;
						break;
				}
			});
		});
		var password = $('#password').val();
    	var confirmPassword = $('#confirmPassword').val();
    
    // Check if any of the password fields is blank
    if (password === '' || confirmPassword === '') {
        displayErrorMessage('Please fill in both password fields.');
        return false;
    }
	else{
		// Check if passwords match
		if (password !== confirmPassword) {
			displayErrorMessage('Passwords do not match.');
			return false;
		}
		else{
			var data = {
				'username': $('#username').val(),
				'first_name': first_name ,
				'last_name': last_name ,
				'email': email ,
				'password': password
			}
			$.ajax({
				type: "post",
				url: "edit-user",
				data: data,
				dataType: "json",
				success: function (response) {
					showAlertAndReload();
				}
			});
		}
	}
	});

	// Remove error message when password fields change
	$(document).on('input', '#password, #confirmPassword', function () {
    $('.error-message').remove();
	});
	// Function to display error message
	function displayErrorMessage(message) {
    $('.error-message').remove();
    $('.addNewPassword').append('<div class="error-message">' + message + '</div>');
	}
	  // Function to show alert and reload page
	function showAlertAndReload() {
		var confirmation = confirm("Success! The page will now be reloaded.");
		if (confirmation) {
		location.reload();
		}
	}
	
});